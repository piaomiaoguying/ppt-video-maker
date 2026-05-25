#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
音频转文字工具
使用 Whisper 将音频文件转录为带时间戳的文字
"""

import os
import sys
import warnings
from pathlib import Path
from typing import Optional

warnings.filterwarnings("ignore", message="FP16 is not supported on CPU")

import platform
IS_APPLE_SILICON = platform.system() == 'Darwin' and platform.machine() == 'arm64'


class AudioTranscriber:
    """音频转文字"""

    def __init__(self):
        self.whisper_model = os.getenv('WHISPER_MODEL', 'base')
        self.whisper_backend = os.getenv('WHISPER_BACKEND', 'auto')
        if self.whisper_backend == 'auto':
            self.whisper_backend = 'mlx' if IS_APPLE_SILICON else 'openai'

    def transcribe(self, audio_path: str) -> Optional[list]:
        """转录音频文件，返回带时间戳的分段列表"""
        audio_file = Path(audio_path)
        if not audio_file.exists():
            print(f"❌ 音频文件不存在: {audio_path}")
            return None

        if self.whisper_backend == 'mlx':
            return self._transcribe_with_mlx(audio_file)
        else:
            return self._transcribe_with_openai(audio_file)

    def _t2s_segments(self, raw_segments: list) -> list:
        try:
            from opencc import OpenCC
            cc = OpenCC('t2s')
            return [
                {'text': cc.convert(seg['text'].strip()), 'start': seg['start'], 'end': seg['end']}
                for seg in raw_segments
            ]
        except ImportError:
            print("⚠️  未安装 opencc，繁体转简体跳过（安装: pip install OpenCC）")
            return [
                {'text': seg['text'].strip(), 'start': seg['start'], 'end': seg['end']}
                for seg in raw_segments
            ]

    def _get_local_model_path(self, model_name: str) -> Optional[str]:
        try:
            from huggingface_hub import scan_cache_dir
            cache = scan_cache_dir()
            for repo in cache.repos:
                if repo.repo_id == model_name:
                    for revision in repo.revisions:
                        snapshot_path = str(revision.snapshot_path)
                        if Path(snapshot_path).exists():
                            return snapshot_path
        except Exception:
            pass
        return None

    def _transcribe_with_mlx(self, audio_file: Path) -> Optional[list]:
        print(f"🔄 正在使用 mlx-whisper 转录音频 (模型: {self.whisper_model})...")

        try:
            import mlx_whisper

            model_name = f"mlx-community/whisper-{self.whisper_model}-mlx"
            model_path = self._get_local_model_path(model_name)
            if model_path:
                print(f"📦 使用本地缓存模型: {model_path}")
            else:
                print(f"🌐 本地无缓存，将从 HuggingFace 下载模型: {model_name}")
                model_path = model_name

            result = mlx_whisper.transcribe(
                str(audio_file),
                path_or_hf_repo=model_path,
                verbose=True
            )

            segments = self._t2s_segments(result.get('segments', []))
            total_text = ''.join([seg['text'] for seg in segments])
            print(f"✅ 转录完成，共 {len(total_text)} 字符，{len(segments)} 个分段")
            return segments

        except ImportError:
            print("❌ 未安装 mlx-whisper，尝试使用 openai-whisper...")
            print("💡 建议运行: pip install mlx-whisper")
            return self._transcribe_with_openai(audio_file)
        except Exception as e:
            print(f"❌ mlx-whisper 转录失败: {e}")
            print("🔄 尝试使用 openai-whisper...")
            return self._transcribe_with_openai(audio_file)

    def _transcribe_with_openai(self, audio_file: Path) -> Optional[list]:
        print(f"🔄 正在使用 openai-whisper 转录音频 (模型: {self.whisper_model})...")

        try:
            import whisper
            import torch

            if IS_APPLE_SILICON and torch.backends.mps.is_available():
                device = "mps"
            else:
                device = "cpu"

            model = whisper.load_model(self.whisper_model, device=device)
            result = model.transcribe(str(audio_file), verbose=True)

            segments = self._t2s_segments(result['segments'])
            total_text = ''.join([seg['text'] for seg in segments])
            print(f"✅ 转录完成，共 {len(total_text)} 字符，{len(segments)} 个分段")
            return segments

        except ImportError:
            print("❌ 未安装 openai-whisper")
            print("💡 请运行: pip install openai-whisper")
            return None
        except Exception as e:
            print(f"❌ 转录失败: {e}")
            return None

    def _seconds_to_timestamp(self, seconds: float) -> str:
        minutes = int(seconds // 60)
        secs = int(seconds % 60)
        return f"{minutes:02d}:{secs:02d}"

    def transcribe_and_save(self, audio_path: str, output_dir: str = '.') -> Optional[Path]:
        """转录并保存为文本文件，返回文件路径"""
        segments = self.transcribe(audio_path)
        if not segments:
            return None

        audio_name = Path(audio_path).stem
        output_file = Path(output_dir) / f'{audio_name}_transcript.txt'

        with open(output_file, 'w', encoding='utf-8') as f:
            for seg in segments:
                timestamp = self._seconds_to_timestamp(seg['start'])
                f.write(f"[{timestamp}] {seg['text']}\n")

        print(f"💾 转录文件已保存到: {output_file}")
        return output_file


def main():
    if len(sys.argv) < 2:
        print("使用方法:")
        print("  python audio_transcriber.py <音频文件路径> [输出目录]")
        sys.exit(1)

    audio_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else '.'

    transcriber = AudioTranscriber()
    transcriber.transcribe_and_save(audio_path, output_dir)


if __name__ == '__main__':
    main()
