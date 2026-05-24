// 音频配置：每页的音频文件和时长（秒）
// 动画时长固定为 5 秒，之后画面静止等待音频结束

export interface SlideConfig {
  audioFile: string;
  audioDuration: number; // 秒
  animationDuration: number; // 秒（动画播放时间）
}

// 音频时长（从 ffprobe 获取）- CC Switch 图片整流器 (重新生成)
const audioDurations = [
  28.00,   // 01_第1页 封面
  38.72,   // 02_第2页 为什么需要本项目
  49.28,   // 03_第3页 传统方案的死结
  19.84,   // 04_第4页 关闭整流器的效果
  30.56,   // 05_第5页 本项目的解法
  55.04,   // 06_第6页 传统方案对比
  25.60,   // 07_第7页 启用整流器的效果
  32.48,   // 08_第8页 OpenCode兼容效果
  52.64,   // 09_第9页 两层防线的分工
  36.16,   // 10_第10页 图片整流器特性
  22.24,   // 11_第11页 整流器开关配置界面
  45.28,   // 12_第12页 图片分析skill详解
  29.44,   // 13_第13页 预置AI供应商
  56.96,   // 14_第14页 安装与配置
  41.60,   // 15_第15页 结尾
];

export const slideConfigs: SlideConfig[] = audioDurations.map((duration, index) => ({
  audioFile: `audio/CC-Switch图片整流器/${String(index + 1).padStart(2, '0')}_第${index + 1}页.wav`,
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
