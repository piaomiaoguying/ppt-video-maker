#!/usr/bin/env python3
import os, re, base64, requests, argparse

from config import API_KEY, API_URL, MODEL

parser = argparse.ArgumentParser(description='从TTS发言稿生成音频文件')
parser.add_argument('--input', '-i', help='输入发言稿文件路径（默认：./发言稿_TTS版.md）')
parser.add_argument('--output', '-o', help='输出音频目录路径（默认：./audio_output/）')
args = parser.parse_args()

script_dir = os.path.dirname(os.path.abspath(__file__))

# 设置输入文件路径
if args.input:
    input_file = args.input
else:
    input_file = os.path.join(script_dir, '发言稿_TTS版.md')

# 设置输出目录路径
if args.output:
    output_dir = args.output
else:
    output_dir = os.path.join(script_dir, 'audio_output')

os.makedirs(output_dir, exist_ok=True)

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
page_lines = [i for i, line in enumerate(lines) if line.startswith('## 第') and '页：' in line]
print(f'找到 {len(page_lines)} 页')

def extract_text(start_idx, end_idx):
    text = '\n'.join(lines[start_idx:end_idx])
    text = re.sub(r'```[\s\S]*?```', '', text)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'【.*?】', '', text)
    text = re.sub(r'^>\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'^[-*]\s*', '', text, flags=re.MULTILINE)
    return text.strip()

def generate_speech(text, output_file):
    headers = {'Authorization': f'Bearer {API_KEY}', 'Content-Type': 'application/json'}
    # 修改：把实际文本放在 assistant 消息中
    data = {'model': MODEL, 'messages': [
        {'role': 'user', 'content': '请朗读以下内容'},
        {'role': 'assistant', 'content': f'<style>正常</style>{text}'}
    ]}
    try:
        resp = requests.post(API_URL, json=data, headers=headers, timeout=120)
        result = resp.json()
        if 'choices' in result and result['choices'][0]['message'].get('audio'):
            audio = base64.b64decode(result['choices'][0]['message']['audio']['data'])
            with open(output_file, 'wb') as f: f.write(audio)
            return True
        else:
            print(f'  API 返回错误：{result}')
            return False
    except Exception as e:
        print(f'  失败：{e}')
    return False

for i, start in enumerate(page_lines):
    end = page_lines[i+1] if i+1 < len(page_lines) else len(lines)
    page_num = i + 1
    title = lines[start]
    text = extract_text(start+1, end)
    filename = f'{page_num:02d}_第{page_num}页.wav'
    filepath = os.path.join(output_dir, filename)
    print(f'生成第{page_num}页：{title[:20]}... (文本长度:{len(text)})')
    if generate_speech(text, filepath):
        print(f'  成功 ({os.path.getsize(filepath)/1024:.1f}KB)')

print(f'\n完成！保存到：{output_dir}')
