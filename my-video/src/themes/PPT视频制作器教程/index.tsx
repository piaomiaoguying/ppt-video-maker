import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, useVideoConfig, Html5Audio, staticFile } from "remotion";
import {
  Slide1, Slide2, Slide3, Slide4, Slide5, Slide6,
  Slide7, Slide8, Slide9, Slide10, Slide11, Slide12, Slide13, Slide14
} from "./slides";
import { slideConfigs, getSlideDurationInFrames, getAnimationEndFrame } from "./audioConfig";
import { AnimationEndFrameProvider } from "./components";

// 所有幻灯片组件（PPT视频制作器教程 - 14页）
const slideComponents = [
  Slide1, Slide2, Slide3, Slide4, Slide5, Slide6,
  Slide7, Slide8, Slide9, Slide10, Slide11, Slide12, Slide13, Slide14
];

// 过渡动画组件
const Transition: React.FC<{
  children: React.ReactNode;
  isLast: boolean;
  slideDuration: number;
}> = ({ children, isLast, slideDuration }) => {
  const frame = useCurrentFrame();
  
  // 入场动画
  const enterOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  // 退场动画（最后20帧淡出，最后一页不淡出）
  const exitOpacity = isLast 
    ? 1 
    : interpolate(frame, [slideDuration - 20, slideDuration], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  
  const opacity = enterOpacity * exitOpacity;
  
  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

// 单个幻灯片包装器（带音频）
const SlideWrapper: React.FC<{
  SlideComponent: React.FC<{ animationEndFrame: number }>;
  config: typeof slideConfigs[0];
  isLast: boolean;
}> = ({ SlideComponent, config, isLast }) => {
  const { fps } = useVideoConfig();
  const slideDuration = getSlideDurationInFrames(config, fps);
  const animationEndFrame = getAnimationEndFrame(config, fps);
  
  return (
    <AbsoluteFill>
      {/* 音频 */}
      <Html5Audio src={staticFile(config.audioFile)} />
      
      {/* 幻灯片内容 */}
      <Transition isLast={isLast} slideDuration={slideDuration}>
        <AnimationEndFrameProvider animationEndFrame={animationEndFrame}>
          <SlideComponent animationEndFrame={animationEndFrame} />
        </AnimationEndFrameProvider>
      </Transition>
    </AbsoluteFill>
  );
};

// 主视频组件
export const PPTVideoMakerVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  
  let currentFrame = 0;
  
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      {slideComponents.map((SlideComponent, index) => {
        const config = slideConfigs[index];
        const slideDuration = getSlideDurationInFrames(config, fps);
        const startFrame = currentFrame;
        currentFrame += slideDuration;
        
        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={slideDuration}
          >
            <SlideWrapper
              SlideComponent={SlideComponent}
              config={config}
              isLast={index === slideComponents.length - 1}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// 导出配置
export const videoConfig = {
  id: "PPT视频制作器教程",
  fps: 30,
  width: 1920,
  height: 1080,
  // durationInFrames 将通过 calculateMetadata 动态计算
};

export default PPTVideoMakerVideo;
