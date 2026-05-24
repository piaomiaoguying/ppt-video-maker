import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// 渐入动画
export const useFadeIn = (delay: number = 0, duration: number = 15) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return interpolate(
    frame - delay,
    [0, duration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
};

// 弹性滑入动画
export const useSlideIn = (delay: number = 0, direction: "left" | "right" | "up" | "down" = "up", distance: number = 100) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.5 }
  });
  
  const axis = direction === "left" || direction === "right" ? "X" : "Y";
  const sign = direction === "right" || direction === "down" ? 1 : -1;
  
  return `translate${axis}(${interpolate(progress, [0, 1], [sign * distance, 0])}px)`;
};

// 缩放动画
export const useScale = (delay: number = 0, from: number = 0.8, to: number = 1) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 }
  });
  
  return interpolate(progress, [0, 1], [from, to]);
};

// 数字递增动画
export const useCountUp = (delay: number = 0, duration: number = 30, from: number = 0, to: number = 100) => {
  const frame = useCurrentFrame();
  
  return Math.floor(interpolate(
    frame - delay,
    [0, duration],
    [from, to],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ));
};

// 颜色常量
export const colors = {
  primary: "#00d4ff",
  secondary: "#7b2cbf",
  accent: "#ff6b6b",
  success: "#00ff88",
  text: "#ffffff",
  textMuted: "#888888",
  textDark: "#666666",
  background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
  cardBg: "rgba(255,255,255,0.05)",
  cardBorder: "rgba(255,255,255,0.1)",
};

// 计算每个slide的帧数（假设每页展示5秒，30fps）
export const SLIDE_DURATION = 150; // 5 seconds per slide
export const FPS = 30;
