import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig, Html5Audio, staticFile, useCurrentFrame, interpolate } from "remotion";
import {
  Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8,
  Slide9, Slide10, Slide11, Slide12, Slide13, Slide14, Slide15,
} from "./slides";
import { slideConfigs, getSlideDurationInFrames, getAnimationEndFrame } from "./audioConfig";
import { AnimationEndFrameProvider } from "./components";

const slideComponents = [
  Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8,
  Slide9, Slide10, Slide11, Slide12, Slide13, Slide14, Slide15,
];

const Transition: React.FC<{
  children: React.ReactNode;
  isLast: boolean;
  slideDuration: number;
}> = ({ children, isLast, slideDuration }) => {
  const frame = useCurrentFrame();

  const enterOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      <Html5Audio src={staticFile(config.audioFile)} />
      <Transition isLast={isLast} slideDuration={slideDuration}>
        <AnimationEndFrameProvider animationEndFrame={animationEndFrame}>
          <SlideComponent animationEndFrame={animationEndFrame} />
        </AnimationEndFrameProvider>
      </Transition>
    </AbsoluteFill>
  );
};

export const CCSwitchVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ background: "#FAFAF7" }}>
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

export const videoConfig = {
  id: "CC-Switch图片整流器",
  fps: 30,
  width: 1920,
  height: 1080,
};

export default CCSwitchVideo;
