import { Composition, CalculateMetadataFunction } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { PPTVideoMakerVideo, videoConfig as pptVideoMakerConfig } from "./themes/PPT视频制作器教程";
import { getTotalDuration as getPPTVideoMakerTotalDuration } from "./themes/PPT视频制作器教程/audioConfig";
import { CCSwitchVideo, videoConfig as ccSwitchConfig } from "./themes/CC-Switch图片整流器";
import { getTotalDuration as getCCSwitchTotalDuration } from "./themes/CC-Switch图片整流器/audioConfig";

// PPT视频制作器教程视频的 props 类型
type PPTVideoMakerProps = {};

// CC-Switch图片整流器视频的 props 类型
type CCSwitchProps = {};

// 动态计算PPT视频制作器教程视频时长
const calculatePPTVideoMakerMetadata: CalculateMetadataFunction<
  PPTVideoMakerProps
> = async () => {
  const fps = pptVideoMakerConfig.fps;
  const totalDuration = getPPTVideoMakerTotalDuration(fps);

  return {
    durationInFrames: totalDuration,
  };
};

// 动态计算CC-Switch图片整流器视频时长
const calculateCCSwitchMetadata: CalculateMetadataFunction<
  CCSwitchProps
> = async () => {
  const fps = ccSwitchConfig.fps;
  const totalDuration = getCCSwitchTotalDuration(fps);

  return {
    durationInFrames: totalDuration,
  };
};

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* PPT视频制作器教程视频 */}
      <Composition
        id={pptVideoMakerConfig.id}
        component={PPTVideoMakerVideo}
        durationInFrames={150} // 默认值，会被 calculateMetadata 覆盖
        fps={pptVideoMakerConfig.fps}
        width={pptVideoMakerConfig.width}
        height={pptVideoMakerConfig.height}
        calculateMetadata={calculatePPTVideoMakerMetadata}
      />

      {/* CC-Switch图片整流器视频 */}
      <Composition
        id={ccSwitchConfig.id}
        component={CCSwitchVideo}
        durationInFrames={150} // 默认值，会被 calculateMetadata 覆盖
        fps={ccSwitchConfig.fps}
        width={ccSwitchConfig.width}
        height={ccSwitchConfig.height}
        calculateMetadata={calculateCCSwitchMetadata}
      />

      {/* 原有的HelloWorld示例 */}
    </>
  );
};
