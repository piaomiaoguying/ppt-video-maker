import React, { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img } from "remotion";

// Anthropic 风格配色
const ANTHROPIC = {
  bg: "#FAFAF7",
  bgSoft: "#F2EFE9",
  surface: "#FFFFFF",
  surface2: "#F5F2EB",
  border: "rgba(0,0,0,0.06)",
  borderStrong: "rgba(0,0,0,0.12)",
  text1: "#141413",
  text2: "#4A4845",
  text3: "#8A8784",
  accent: "#D97706",
  accent2: "#B45309",
  accent3: "#F59E0B",
  good: "#059669",
  warn: "#D97706",
  bad: "#DC2626",
};

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

export const useClampedFrame = () => {
  const frame = useCurrentFrame();
  const animationEndFrame = useAnimationEndFrame();
  return Math.min(frame, animationEndFrame);
};

// 全屏背景
export const SlideBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: ANTHROPIC.bg,
      padding: "72px 96px",
      fontFamily: "'Inter', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      color: ANTHROPIC.text1,
      overflow: "hidden",
    }}
  >
    <div style={{
      position: "absolute",
      inset: 0,
      background: `
        radial-gradient(60% 50% at 90% 10%, rgba(217,119,6,0.06), transparent 60%),
        radial-gradient(50% 50% at 10% 90%, rgba(180,83,9,0.04), transparent 60%)
      `,
      pointerEvents: "none",
      zIndex: 0,
    }} />
    <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {children}
    </div>
  </AbsoluteFill>
);

// Kicker / 小节标签
export const Kicker: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useClampedFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <p style={{
      color: ANTHROPIC.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
      fontWeight: 600, letterSpacing: "0.02em", marginBottom: 24, opacity,
    }}>{"> "}{children}</p>
  );
};

// 标题
export const SlideTitle: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 80 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [-50, 0]);
  return (
    <h1 style={{
      fontSize: 52, lineHeight: 1.08, fontWeight: 800, letterSpacing: "-0.03em",
      color: ANTHROPIC.text1, marginBottom: 30, opacity, transform: `translateY(${translateY}px)`, ...style,
    }}>{children}</h1>
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
    <p style={{ fontSize: 22, color: ANTHROPIC.text2, lineHeight: 1.6, marginBottom: 30, opacity }}>{children}</p>
  );
};

// 卡片
export const Card: React.FC<{
  title?: string;
  children: React.ReactNode;
  delay?: number;
  accentColor?: string;
}> = ({ title, children, delay = 0, accentColor = ANTHROPIC.accent }) => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 100 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);
  const translateY = interpolate(progress, [0, 1], [30, 0]);
  return (
    <div style={{
      background: ANTHROPIC.surface, border: `1px solid ${ANTHROPIC.border}`,
      borderTop: `3px solid ${accentColor}`, borderRadius: 14, padding: 28,
      opacity, transform: `scale(${scale}) translateY(${translateY}px)`,
    }}>
      {title && <div style={{ fontSize: 22, fontWeight: 600, color: ANTHROPIC.text1, marginBottom: 12 }}>{title}</div>}
      <div style={{ fontSize: 16, lineHeight: 1.6, color: ANTHROPIC.text2 }}>{children}</div>
    </div>
  );
};

// 列表项
export const ListItem: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color }) => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 120 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-20, 0]);
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", marginBottom: 12,
      fontSize: 16, lineHeight: 1.6, opacity, transform: `translateX(${translateX}px)`,
    }}>
      <span style={{ color: color || ANTHROPIC.accent, marginRight: 10, fontSize: 14, flexShrink: 0 }}>▸</span>
      <span style={{ color: ANTHROPIC.text2 }}>{children}</span>
    </div>
  );
};

// 高亮
export const Highlight: React.FC<{
  children: React.ReactNode;
  color?: "blue" | "purple" | "green" | "cyan" | "red" | "warn" | "white";
}> = ({ children, color = "blue" }) => {
  const colorMap: Record<string, string> = {
    blue: ANTHROPIC.accent, purple: ANTHROPIC.accent2, green: ANTHROPIC.good, cyan: ANTHROPIC.accent3,
    red: ANTHROPIC.bad, warn: ANTHROPIC.warn, white: ANTHROPIC.text1,
  };
  return <span style={{ color: colorMap[color], fontWeight: 600 }}>{children}</span>;
};

// 标签
export const Tag: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({ children, delay = 0, color }) => {
  const frame = useClampedFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
      borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
      background: ANTHROPIC.surface2, border: `1px solid ${ANTHROPIC.border}`, color: color || ANTHROPIC.text3, opacity,
    }}>{children}</span>
  );
};

// 网格
export const Grid: React.FC<{
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  gap?: number;
}> = ({ children, cols = 2, gap = 30 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, width: "100%" }}>
    {children}
  </div>
);

// 居中容器
export const CenterContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    flex: 1, display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center", textAlign: "center",
  }}>{children}</div>
);

// 引用
export const Quote: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 80 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-30, 0]);
  return (
    <div style={{
      fontSize: 20, fontStyle: "italic", color: ANTHROPIC.text2,
      borderLeft: `4px solid ${ANTHROPIC.accent2}`, paddingLeft: 24, margin: "20px 0",
      opacity, transform: `translateX(${translateX}px)`,
    }}>{children}</div>
  );
};

// 强调框
export const AccentBox: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useClampedFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      background: ANTHROPIC.surface, border: `2px solid ${ANTHROPIC.accent}`, borderRadius: 12,
      padding: "20px 28px", fontFamily: "'JetBrains Mono', monospace",
      color: ANTHROPIC.accent, fontSize: 17, textAlign: "center", marginTop: 16, opacity,
    }}>{children}</div>
  );
};

// 截图图片
export const Screenshot: React.FC<{
  src: string;
  maxHeight?: number;
  caption?: string;
  delay?: number;
}> = ({ src, maxHeight = 450, caption, delay = 0 }) => {
  const frame = useClampedFrame();
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ textAlign: "center", opacity }}>
      <Img
        src={src}
        style={{
          width: "100%", maxHeight, objectFit: "contain",
          borderRadius: 12, border: `1px solid ${ANTHROPIC.border}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      />
      {caption && (
        <p style={{ textAlign: "center", color: ANTHROPIC.text3, fontSize: 14, marginTop: 10, fontFamily: "'JetBrains Mono', monospace" }}>
          {caption}
        </p>
      )}
    </div>
  );
};

// 流程步骤
export const FlowSteps: React.FC<{
  steps: string[];
  activeIndex?: number;
}> = ({ steps, activeIndex = -1 }) => {
  const frame = useClampedFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: ANTHROPIC.accent, fontSize: 20, fontWeight: "bold" }}>→</span>}
          <div style={{
            background: i === activeIndex ? `rgba(217,119,6,0.1)` : ANTHROPIC.surface,
            border: `1px solid ${i === activeIndex ? ANTHROPIC.accent : ANTHROPIC.border}`,
            borderRadius: 8, padding: "8px 16px",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: i === activeIndex ? ANTHROPIC.accent : (i === steps.length - 1 ? ANTHROPIC.good : ANTHROPIC.text2),
            whiteSpace: "nowrap",
            opacity: interpolate(frame - i * 8, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>{step}</div>
        </React.Fragment>
      ))}
    </div>
  );
};

// 双栏布局
export const SplitLayout: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
}> = ({ left, right }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", width: "100%" }}>
    <div>{left}</div>
    <div>{right}</div>
  </div>
);

// Provider 卡片
export const ProviderCard: React.FC<{
  name: string;
  models: string;
  delay?: number;
  accentColor?: string;
}> = ({ name, models, delay = 0, accentColor = ANTHROPIC.accent }) => {
  const frame = useClampedFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      background: ANTHROPIC.surface, border: `1px solid ${ANTHROPIC.border}`,
      borderLeft: `3px solid ${accentColor}`, borderRadius: 8, padding: "14px 18px", opacity,
    }}>
      <div style={{ color: ANTHROPIC.text1, fontWeight: 700, fontSize: 15 }}>{name}</div>
      <div style={{ color: ANTHROPIC.text3, fontSize: 12, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{models}</div>
    </div>
  );
};

// 步骤列表项
export const StepItem: React.FC<{
  num: number;
  title: string;
  desc: string;
  delay?: number;
}> = ({ num, title, desc, delay = 0 }) => {
  const frame = useClampedFrame();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "10px 0", opacity }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", background: ANTHROPIC.accent,
        color: ANTHROPIC.bg, display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 16, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
      }}>{num}</div>
      <div>
        <div style={{ color: ANTHROPIC.text1, fontWeight: 600, fontSize: 18 }}>{title}</div>
        <div style={{ color: ANTHROPIC.text3, fontSize: 14, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
};
