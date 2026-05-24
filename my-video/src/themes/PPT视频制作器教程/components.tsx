import React, { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// Context 用于传递 animationEndFrame
const AnimationEndFrameContext = createContext<number>(Infinity);

export const useAnimationEndFrame = () => useContext(AnimationEndFrameContext);

export const AnimationEndFrameProvider: React.FC<{
  animationEndFrame: number;
  children: React.ReactNode;
}> = ({ animationEndFrame, children }) => (
  <AnimationEndFrameContext.Provider value={animationEndFrame}>
    {children}
  </AnimationEndFrameContext.Provider>
);

// 获取帧数，但限制在动画结束帧之后保持静止
export const useClampedFrame = () => {
  const frame = useCurrentFrame();
  const animationEndFrame = useAnimationEndFrame();
  return Math.min(frame, animationEndFrame);
};

// 背景组件
export const SlideBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
      padding: 60,
      fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
      color: "#ffffff",
    }}
  >
    {children}
  </AbsoluteFill>
);

// 标题组件
export const SlideTitle: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 }
  });
  
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [-50, 0]);
  
  return (
    <h1
      style={{
        fontSize: 72,
        fontWeight: 700,
        marginBottom: 50,
        background: "linear-gradient(90deg, #00d4ff, #7b2cbf, #ff6b6b)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </h1>
  );
};

// 副标题
export const SlideSubtitle: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useClampedFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  return (
    <p
      style={{
        fontSize: 36,
        color: "#888888",
        marginBottom: 40,
        opacity,
      }}
    >
      {children}
    </p>
  );
};

// 卡片组件
export const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  delay?: number;
  emoji?: string;
  accentColor?: string;
}> = ({ title, children, delay = 0, emoji, accentColor = "#00d4ff" }) => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 100 }
  });
  
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);
  const translateY = interpolate(progress, [0, 1], [30, 0]);
  
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: 40,
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
      }}
    >
      {emoji && <div style={{ fontSize: 48, marginBottom: 20 }}>{emoji}</div>}
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: accentColor,
          marginBottom: 20,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 22, lineHeight: 1.8, color: "#ccc" }}>
        {children}
      </div>
    </div>
  );
};

// 列表项
export const ListItem: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 120 }
  });
  
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-20, 0]);
  
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        marginBottom: 25,
        fontSize: 26,
        lineHeight: 1.6,
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <span style={{ color: "#00d4ff", marginRight: 15, fontSize: 24 }}>▸</span>
      <span>{children}</span>
    </div>
  );
};

// 高亮文本
export const Highlight: React.FC<{
  children: React.ReactNode;
  color?: "blue" | "purple" | "red" | "green";
}> = ({ children, color = "blue" }) => {
  const colorMap = {
    blue: "#00d4ff",
    purple: "#7b2cbf",
    red: "#ff6b6b",
    green: "#00ff88",
  };
  
  return (
    <span style={{ color: colorMap[color], fontWeight: 600 }}>
      {children}
    </span>
  );
};

// 引用块
export const Quote: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 }
  });
  
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-30, 0]);
  
  return (
    <div
      style={{
        fontSize: 32,
        fontStyle: "italic",
        color: "#888888",
        borderLeft: "4px solid #7b2cbf",
        paddingLeft: 30,
        margin: "30px 0",
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      "{children}"
    </div>
  );
};

// 标签
export const Tag: React.FC<{
  children: React.ReactNode;
  color?: "blue" | "purple" | "red" | "green" | "yellow";
  delay?: number;
}> = ({ children, color = "blue", delay = 0 }) => {
  const frame = useClampedFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  const colorMap = {
    blue: { bg: "rgba(0,212,255,0.2)", color: "#00d4ff" },
    purple: { bg: "rgba(123,44,191,0.2)", color: "#b366e8" },
    red: { bg: "rgba(255,107,107,0.2)", color: "#ff6b6b" },
    green: { bg: "rgba(0,255,136,0.2)", color: "#00ff88" },
    yellow: { bg: "rgba(255,200,0,0.2)", color: "#ffc800" },
  };
  
  return (
    <span
      style={{
        display: "inline-block",
        padding: "8px 16px",
        borderRadius: 20,
        fontSize: 18,
        margin: 5,
        background: colorMap[color].bg,
        color: colorMap[color].color,
        opacity,
      }}
    >
      {children}
    </span>
  );
};

// 居中容器
export const CenterContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  }}>
    {children}
  </div>
);

// 网格容器
export const Grid: React.FC<{
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  gap?: number;
}> = ({ children, cols = 2, gap = 40 }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap,
    width: "100%",
  }}>
    {children}
  </div>
);

// 流程图框
export const FlowBox: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color = "#00d4ff" }) => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 100 }
  });
  
  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  
  return (
    <div
      style={{
        background: `rgba(0,212,255,0.1)`,
        border: `2px solid ${color}`,
        borderRadius: 15,
        padding: "25px 35px",
        fontSize: 22,
        fontWeight: 600,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
};

// 箭头
export const FlowArrow: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useClampedFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  return (
    <span style={{ fontSize: 36, color: "#00d4ff", opacity }}>→</span>
  );
};
