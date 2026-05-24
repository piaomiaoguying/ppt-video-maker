import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import {
  SlideBackground,
  SlideTitle,
  Card,
  ListItem,
  Highlight,
  Quote,
  Tag,
  CenterContent,
  Grid,
  FlowBox,
  FlowArrow,
  useClampedFrame,
} from "./components";

// ============ Slide 1: 封面页 ============
export const Slide1: React.FC<{ animationEndFrame: number }> = () => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  
  const emojiProgress = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });
  const titleProgress = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 80 } });
  const subtitleProgress = spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 80 } });
  
  const emojiScale = interpolate(emojiProgress, [0, 1], [0, 1]);
  const emojiY = interpolate(emojiProgress, [0, 1], [50, 0]);
  
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  
  return (
    <SlideBackground>
      <CenterContent>
        <div
          style={{
            fontSize: 120,
            marginBottom: 30,
            transform: `scale(${emojiScale}) translateY(${emojiY}px)`,
          }}
        >
          🎬
        </div>
        
        <h1
          style={{
            fontSize: 86,
            fontWeight: 700,
            marginBottom: 30,
            background: "linear-gradient(90deg, #00d4ff, #7b2cbf, #ff6b6b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            lineHeight: 1.2,
          }}
        >
          PPT视频制作器
        </h1>
        
        <p
          style={{
            fontSize: 42,
            color: "#888",
            opacity: subtitleProgress,
            marginBottom: 80,
          }}
        >
          从主题调研到视频生成的完整自动化流程
        </p>
        
        <div style={{ opacity: Math.min(1, frame / 60), marginTop: 40 }}>
          <p style={{ fontSize: 28, color: "#666" }}>
            教你如何理解和使用这个强大的 Skill
          </p>
          <p style={{ fontSize: 24, color: "#444", marginTop: 20 }}>
            2026年4月
          </p>
        </div>
      </CenterContent>
    </SlideBackground>
  );
};

// ============ Slide 2: 目录页 ============
export const Slide2: React.FC<{ animationEndFrame: number }> = () => {
  const agendaItems = [
    { num: "01", title: "什么是PPT视频制作器", desc: "核心概念、价值定位和适用场景" },
    { num: "02", title: "完整工作流程", desc: "七个步骤的详细说明和执行要点" },
    { num: "03", title: "文件组织架构", desc: "目录结构和关键配置说明" },
    { num: "04", title: "最佳实践与总结", desc: "使用技巧、常见问题和注意事项" },
  ];
  
  return (
    <SlideBackground>
      <SlideTitle>今日议程</SlideTitle>
      <Grid cols={2} gap={40}>
        {agendaItems.map((item, index) => (
          <Card key={index} title={`${item.num} ${item.title}`} delay={index * 10}>
            {item.desc}
          </Card>
        ))}
      </Grid>
    </SlideBackground>
  );
};

// ============ Slide 3: 什么是PPT视频制作器 ============
export const Slide3: React.FC<{ animationEndFrame: number }> = () => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  
  const titleProgress = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  
  return (
    <SlideBackground>
      <SlideTitle>什么是PPT视频制作器？</SlideTitle>
      <Quote delay={10}>
        一个完整的自动化工作流 Skill，能够从主题调研开始，自动完成 PPT 制作、发言稿生成、音频合成、视频渲染的全流程。
      </Quote>
      <Grid cols={3} gap={40}>
        <Card emoji="🚀" title="全自动化流程" delay={30}>
          从调研到视频一键完成，无需人工干预
        </Card>
        <Card emoji="🧩" title="模块化设计" delay={40}>
          每个环节独立可控，灵活组合使用
        </Card>
        <Card emoji="🎯" title="专业输出" delay={50}>
          符合商业演示标准的高质量视频
        </Card>
      </Grid>
    </SlideBackground>
  );
};

// ============ Slide 4: 适用场景 ============
export const Slide4: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <SlideTitle>适用场景</SlideTitle>
      <Grid cols={2} gap={40}>
        <Card emoji="💼" title="企业培训" delay={0}>
          <ListItem delay={10}>快速制作培训视频</ListItem>
          <ListItem delay={20}>标准化培训内容</ListItem>
          <ListItem delay={30}>支持多主题并行开发</ListItem>
        </Card>
        <Card emoji="📊" title="产品演示" delay={10}>
          <ListItem delay={20}>产品介绍视频</ListItem>
          <ListItem delay={30}>功能演示动画</ListItem>
          <ListItem delay={40}>市场推广素材</ListItem>
        </Card>
        <Card emoji="🎓" title="教学课程" delay={20}>
          <ListItem delay={30}>在线教育内容</ListItem>
          <ListItem delay={40}>知识分享视频</ListItem>
          <ListItem delay={50}>技术讲解材料</ListItem>
        </Card>
        <Card emoji="📈" title="市场调研" delay={30}>
          <ListItem delay={40}>行业分析报告</ListItem>
          <ListItem delay={50}>趋势研究报告</ListItem>
          <ListItem delay={60}>数据可视化展示</ListItem>
        </Card>
      </Grid>
    </SlideBackground>
  );
};

// ============ Slide 5: 完整工作流程概览 ============
export const Slide5: React.FC<{ animationEndFrame: number }> = () => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  
  return (
    <SlideBackground>
      <SlideTitle>完整工作流程</SlideTitle>
      <div style={{ fontSize: 28, color: "#888", marginBottom: 30, opacity: Math.min(1, frame / 20) }}>
        七个步骤，从零到完成
      </div>
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, marginBottom: 30 }}>
        <FlowBox delay={0}>1. 确认主题</FlowBox>
        <FlowArrow delay={5} />
        <FlowBox delay={10}>2. 创建目录</FlowBox>
        <FlowArrow delay={15} />
        <FlowBox delay={20}>3. 联网调研</FlowBox>
        <FlowArrow delay={25} />
        <FlowBox delay={30}>4. 生成文档</FlowBox>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
        <FlowBox delay={35}>5. 制作PPT</FlowBox>
        <FlowArrow delay={40} />
        <FlowBox delay={45}>6. 生成音频</FlowBox>
        <FlowArrow delay={50} />
        <FlowBox delay={55}>7. 渲染视频</FlowBox>
      </div>
      
      <div style={{
        background: "rgba(0,212,255,0.1)",
        borderRadius: 20,
        padding: 30,
        marginTop: 40,
        textAlign: "center"
      }}>
        <span style={{ fontSize: 24, color: "#00d4ff" }}>
          ⏱️ 完整流程约需 10-30 分钟，根据主题复杂度会有差异
        </span>
      </div>
    </SlideBackground>
  );
};

// ============ Slide 6: 步骤详解：前期准备 ============
export const Slide6: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <SlideTitle>步骤详解：前期准备</SlideTitle>
      <Grid cols={2} gap={40}>
        <Card title="📌 步骤 1：确认主题" delay={0}>
          <ListItem delay={10}>触发方式：<Highlight color="blue">/ppt-video-maker 主题名</Highlight></ListItem>
          <ListItem delay={20}>未提供主题时，系统会询问用户</ListItem>
          <ListItem delay={30}>主题明确后进入下一步</ListItem>
        </Card>
        <Card title="📁 步骤 2：创建目录结构" delay={10}>
          <ListItem delay={20}>创建主题专属目录：research/[主题]/</ListItem>
          <ListItem delay={30}>创建音频子目录：audio/</ListItem>
          <ListItem delay={40}>所有文件按主题隔离存储</ListItem>
        </Card>
      </Grid>
      
      <div style={{
        background: "#1e1e1e",
        borderRadius: 12,
        padding: 25,
        marginTop: 30,
        fontFamily: "'Monaco', 'Consolas', monospace",
        fontSize: 18,
        color: "#9cdcfe",
        borderLeft: "4px solid #00d4ff"
      }}>
        <span style={{ color: "#6a9955" }}># 目录结构示例</span><br/>
        research/[主题]/<br/>
        ├── 调研资料.md<br/>
        ├── PPT.html<br/>
        ├── 发言稿.md<br/>
        └── audio/<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;├── 01_第1页.wav<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;└── 02_第2页.wav
      </div>
    </SlideBackground>
  );
};

// ============ Slide 7: 步骤详解：内容创作 ============
export const Slide7: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <SlideTitle>步骤详解：内容创作</SlideTitle>
      <Grid cols={2} gap={40}>
        <Card title="🔍 步骤 3：联网调研" delay={0}>
          <ListItem delay={10}>使用 web_search 多角度搜索</ListItem>
          <ListItem delay={20}>使用 web_fetch 获取详细内容</ListItem>
          <ListItem delay={30}>记录所有参考资料来源</ListItem>
          <ListItem delay={40}>整理核心概念、数据、案例</ListItem>
        </Card>
        <Card title="📝 步骤 4：生成 PPT" delay={10}>
          <ListItem delay={20}>基于模板生成 HTML PPT</ListItem>
          <ListItem delay={30}>选择合适的幻灯片类型</ListItem>
          <ListItem delay={40}>封面页必须有 active 类</ListItem>
          <ListItem delay={50}>ID 必须连续且唯一</ListItem>
        </Card>
      </Grid>
      <Quote delay={60}>
        PPT 类型包括：封面、目录、双栏、三栏、流程图、时间线、对比表格、总结页、结束页等
      </Quote>
    </SlideBackground>
  );
};

// ============ Slide 8: 步骤详解：音频制作 ============
export const Slide8: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <SlideTitle>步骤详解：音频制作</SlideTitle>
      <Grid cols={2} gap={40}>
        <Card title="🎤 步骤 5：生成发言稿" delay={0}>
          <ListItem delay={10}>格式：<Highlight color="red">## 第N页：标题</Highlight></ListItem>
          <ListItem delay={20}>使用中文冒号，避免网址和代码块</ListItem>
          <ListItem delay={30}>数字口语化（15000 → 一万五千）</ListItem>
          <ListItem delay={40}>英文缩写需要解释</ListItem>
        </Card>
        <Card title="🔊 步骤 6：生成音频" delay={10}>
          <ListItem delay={20}>运行 TTS 脚本生成音频</ListItem>
          <ListItem delay={30}>输出格式：01_第1页.wav</ListItem>
          <ListItem delay={40}>每页独立音频文件</ListItem>
          <ListItem delay={50}>确保虚拟环境已激活</ListItem>
        </Card>
      </Grid>
      <div style={{
        background: "rgba(123,44,191,0.1)",
        borderRadius: 20,
        padding: 30,
        marginTop: 30,
        textAlign: "center"
      }}>
        <span style={{ fontSize: 22, color: "#b366e8" }}>
          💡 TTS 发言稿质量直接影响音频效果，务必遵循格式规范
        </span>
      </div>
    </SlideBackground>
  );
};

// ============ Slide 9: 步骤详解：视频制作 ============
export const Slide9: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <SlideTitle>步骤详解：视频制作</SlideTitle>
      <Grid cols={2} gap={40}>
        <Card title="🎬 步骤 7：生成 Remotion 视频" delay={0}>
          <ListItem delay={10}>创建主题组件目录</ListItem>
          <ListItem delay={20}>复制音频文件到指定位置</ListItem>
          <ListItem delay={30}>创建 5 个必需文件</ListItem>
          <ListItem delay={40}>在 Root.tsx 注册 Composition</ListItem>
          <ListItem delay={50}>预览确认效果</ListItem>
          <ListItem delay={60}>渲染输出最终视频</ListItem>
        </Card>
        <Card title="📁 必需文件" delay={10}>
          <ListItem delay={20}>index.tsx - 主视频组件</ListItem>
          <ListItem delay={30}>audioConfig.ts - 音频配置</ListItem>
          <ListItem delay={40}>slides.tsx - 幻灯片组件</ListItem>
          <ListItem delay={50}>components.tsx - 公共组件</ListItem>
          <ListItem delay={60}>utils.ts - 工具函数</ListItem>
        </Card>
      </Grid>
    </SlideBackground>
  );
};

// ============ Slide 10: 关键配置说明 ============
export const Slide10: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <SlideTitle>关键配置说明</SlideTitle>
      <Grid cols={2} gap={40}>
        <Card emoji="⚙️" title="audioConfig.ts 配置" delay={0}>
          <div style={{
            background: "#1e1e1e",
            borderRadius: 12,
            padding: 20,
            fontFamily: "'Monaco', 'Consolas', monospace",
            fontSize: 16,
            color: "#9cdcfe",
            marginBottom: 15
          }}>
            audioFile: `audio/[主题名]/01_第1页.wav`
          </div>
          <ListItem delay={20}>音频路径必须包含主题名</ListItem>
        </Card>
        <Card emoji="📋" title="Root.tsx 注册" delay={10}>
          <ListItem delay={20}>Composition ID 必须唯一</ListItem>
          <ListItem delay={30}>导入主题组件和配置</ListItem>
          <ListItem delay={40}>创建元数据计算函数</ListItem>
          <ListItem delay={50}>在 RemotionRoot 中注册</ListItem>
        </Card>
      </Grid>
      <Quote delay={60}>
        主题隔离原则：每个主题有独立的组件目录、音频目录和 Composition ID
      </Quote>
    </SlideBackground>
  );
};

// ============ Slide 11: 最佳实践 ============
export const Slide11: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <SlideTitle>最佳实践</SlideTitle>
      <Grid cols={3} gap={40}>
        <Card title="✅ 内容创作" delay={0}>
          <ListItem delay={10}>调研要深入</ListItem>
          <ListItem delay={20}>数据要核实</ListItem>
          <ListItem delay={30}>版权要注意</ListItem>
          <ListItem delay={40}>质量要检查</ListItem>
        </Card>
        <Card title="🔧 技术实现" delay={10}>
          <ListItem delay={20}>主题要隔离</ListItem>
          <ListItem delay={30}>路径要规范</ListItem>
          <ListItem delay={40}>ID 要唯一</ListItem>
          <ListItem delay={50}>格式要遵守</ListItem>
        </Card>
        <Card title="🔄 工作流程" delay={20}>
          <ListItem delay={30}>预览要先行</ListItem>
          <ListItem delay={40}>调试要增量</ListItem>
          <ListItem delay={50}>版本要管理</ListItem>
          <ListItem delay={60}>资源要清理</ListItem>
        </Card>
      </Grid>
    </SlideBackground>
  );
};

// ============ Slide 12: 常见问题处理 ============
export const Slide12: React.FC<{ animationEndFrame: number }> = () => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  
  const problems = [
    { problem: "TTS 音频生成失败", cause: "发言稿格式不正确、包含代码块", solution: "检查页码格式、移除代码块" },
    { problem: "Remotion 渲染失败", cause: "依赖不完整、路径错误", solution: "重新安装依赖、检查路径" },
    { problem: "主题冲突", cause: "Composition ID 重复", solution: "确保每个主题 ID 唯一" },
    { problem: "音频文件找不到", cause: "音频路径配置错误", solution: "检查 audioConfig.ts 路径" },
  ];
  
  return (
    <SlideBackground>
      <SlideTitle>常见问题处理</SlideTitle>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 30 }}>
        <thead>
          <tr>
            <th style={{ background: "rgba(0,212,255,0.2)", padding: 20, fontSize: 24, textAlign: "left", borderBottom: "2px solid #00d4ff", width: "25%" }}>问题类型</th>
            <th style={{ background: "rgba(0,212,255,0.2)", padding: 20, fontSize: 24, textAlign: "left", borderBottom: "2px solid #00d4ff", width: "35%" }}>可能原因</th>
            <th style={{ background: "rgba(0,212,255,0.2)", padding: 20, fontSize: 24, textAlign: "left", borderBottom: "2px solid #00d4ff", width: "40%" }}>解决方案</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((item, index) => {
            const rowProgress = spring({ frame: frame - index * 15, fps, config: { damping: 15, stiffness: 80 } });
            const opacity = interpolate(rowProgress, [0, 1], [0, 1]);
            
            return (
              <tr key={index} style={{ opacity }}>
                <td style={{ padding: 20, fontSize: 22, borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#ccc" }}><strong>{item.problem}</strong></td>
                <td style={{ padding: 20, fontSize: 22, borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#ccc" }}>{item.cause}</td>
                <td style={{ padding: 20, fontSize: 22, borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#ccc" }}>{item.solution}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </SlideBackground>
  );
};

// ============ Slide 13: 总结 ============
export const Slide13: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <SlideTitle>总结</SlideTitle>
      <Grid cols={3} gap={40}>
        <Card title="📌 核心要点" delay={0}>
          <ListItem delay={10}>七步完整流程</ListItem>
          <ListItem delay={20}>主题隔离架构</ListItem>
          <ListItem delay={30}>严格格式规范</ListItem>
        </Card>
        <Card title="🎯 核心优势" delay={10}>
          <ListItem delay={20}>全流程自动化</ListItem>
          <ListItem delay={30}>模块化设计</ListItem>
          <ListItem delay={40}>专业输出质量</ListItem>
        </Card>
        <Card title="💡 使用建议" delay={20}>
          <ListItem delay={30}>先熟悉流程</ListItem>
          <ListItem delay={40}>从简单开始</ListItem>
          <ListItem delay={50}>善用预览功能</ListItem>
        </Card>
      </Grid>
      <div style={{
        background: "rgba(123,44,191,0.1)",
        borderRadius: 20,
        padding: 30,
        marginTop: 30,
        textAlign: "center"
      }}>
        <div style={{ fontSize: 22, color: "#b366e8", marginBottom: 15 }}>
          🚀 掌握这个 Skill，快速制作专业级演示视频
        </div>
        <div style={{ fontSize: 36, color: "#fff" }}>
          大大提升内容创作效率！
        </div>
      </div>
    </SlideBackground>
  );
};

// ============ Slide 14: 结束页 ============
export const Slide14: React.FC<{ animationEndFrame: number }> = () => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();
  
  const emojiProgress = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });
  const titleProgress = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 80 } });
  
  return (
    <SlideBackground>
      <CenterContent>
        <div style={{ fontSize: 120, marginBottom: 30, transform: `scale(${emojiProgress})` }}>
          🎉
        </div>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            marginBottom: 30,
            background: "linear-gradient(90deg, #00d4ff, #7b2cbf, #ff6b6b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: titleProgress,
          }}
        >
          感谢聆听
        </h1>
        <p style={{ fontSize: 32, color: "#888", marginBottom: 80, opacity: Math.min(1, frame / 45) }}>
          欢迎提问与交流
        </p>
        <div style={{ fontSize: 24, color: "#666", opacity: Math.min(1, frame / 60) }}>
          <p>参考文档：.iflow/commands/ppt-video-maker.md</p>
        </div>
        <Grid cols={3} gap={40}>
          <div style={{ textAlign: "center", opacity: Math.min(1, frame / 75) }}>
            <div style={{ fontSize: 32, color: "#00d4ff" }}>模板文件</div>
            <div style={{ fontSize: 18, color: "#666", marginTop: 10 }}>templates/</div>
          </div>
          <div style={{ textAlign: "center", opacity: Math.min(1, frame / 90) }}>
            <div style={{ fontSize: 32, color: "#7b2cbf" }}>脚本文件</div>
            <div style={{ fontSize: 18, color: "#666", marginTop: 10 }}>script/</div>
          </div>
          <div style={{ textAlign: "center", opacity: Math.min(1, frame / 105) }}>
            <div style={{ fontSize: 32, color: "#ff6b6b" }}>配置文件</div>
            <div style={{ fontSize: 18, color: "#666", marginTop: 10 }}>my-video/src/</div>
          </div>
        </Grid>
      </CenterContent>
    </SlideBackground>
  );
};
