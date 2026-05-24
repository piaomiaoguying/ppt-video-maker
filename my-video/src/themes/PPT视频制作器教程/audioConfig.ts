// 音频配置：每页的音频文件和时长（秒）
// 动画时长固定为 5 秒，之后画面静止等待音频结束

export interface SlideConfig {
  audioFile: string;
  audioDuration: number; // 秒
  animationDuration: number; // 秒（动画播放时间）
}

// 音频时长（从 ffprobe 获取）- PPT视频制作器教程
const audioDurations = [
  32.16,   // 01_第1页 封面
  24.16,   // 02_第2页 今日议程
  43.84,   // 03_第3页 什么是PPT视频制作器
  51.52,   // 04_第4页 适用场景
  41.76,   // 05_第5页 完整工作流程概览
  48.96,   // 06_第6页 步骤详解：前期准备
  55.52,   // 07_第7页 步骤详解：内容创作
  51.84,   // 08_第8页 步骤详解：音频制作
  51.20,   // 09_第9页 步骤详解：视频制作
  51.04,   // 10_第10页 关键配置说明
  46.08,   // 11_第11页 最佳实践
  70.72,   // 12_第12页 常见问题处理
  46.24,   // 13_第13页 总结
  22.08,   // 14_第14页 结束页
];

export const slideConfigs: SlideConfig[] = audioDurations.map((duration, index) => ({
  audioFile: `audio/PPT视频制作器教程/${String(index + 1).padStart(2, '0')}_第${index + 1}页.wav`,
  audioDuration: duration,
  animationDuration: 5, // 动画固定5秒
}));

// 计算每页的总帧数
export const getSlideDurationInFrames = (config: SlideConfig, fps: number = 30) => {
  return Math.ceil(config.audioDuration * fps);
};

// 计算动画结束帧
export const getAnimationEndFrame = (config: SlideConfig, fps: number = 30) => {
  return Math.ceil(config.animationDuration * fps);
};

// 计算总时长
export const getTotalDuration = (fps: number = 30) => {
  return slideConfigs.reduce((sum, config) => sum + getSlideDurationInFrames(config, fps), 0);
};
