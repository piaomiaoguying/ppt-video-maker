import React from "react";
import { useVideoConfig, spring, interpolate, staticFile } from "remotion";
import {
  SlideBackground, Kicker, SlideTitle, SlideSubtitle, Card, ListItem,
  Highlight, Tag, Grid, CenterContent, Quote, AccentBox, Screenshot,
  FlowSteps, SplitLayout, ProviderCard, StepItem, useClampedFrame,
} from "./components";

// ====== Slide 1: 封面 ======
export const Slide1: React.FC<{ animationEndFrame: number }> = () => {
  const frame = useClampedFrame();
  const subtitleOpacity = interpolate(frame - 20, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagsOpacity = interpolate(frame - 35, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SlideBackground>
      <CenterContent>
        <Kicker delay={0}>cc-switch / open-source</Kicker>
        <SlideTitle delay={5}>
          Ctrl+V 粘贴截图，<br/>Claude Code + DeepSeek 直接烂对话？<br/>
          <span style={{ background: "linear-gradient(135deg,#D97706,#B45309 55%,#DC2626)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>这个开源项目把坑填了</span>
        </SlideTitle>
        <div style={{ opacity: subtitleOpacity }}>
          <SlideSubtitle delay={20}>CC Switch 图片整流器 — 图片整流器 + 多 Provider 视觉分析技能</SlideSubtitle>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", opacity: tagsOpacity }}>
          <Tag delay={35}>Claude Code</Tag>
          <Tag delay={40}>OpenCode</Tag>
          <Tag delay={45}>DeepSeek</Tag>
          <Tag delay={50}>30+ Providers</Tag>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 32, opacity: tagsOpacity }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#D97706,#B45309)" }} />
          <div>
            <div style={{ color: "#141413", fontSize: 16, fontWeight: 600 }}>@piaomiaoguying</div>
            <div style={{ color: "#8A8784", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>github.com/piaomiaoguying/cc-switch</div>
          </div>
        </div>
      </CenterContent>
    </SlideBackground>
  );
};

// ====== Slide 2: 为什么需要本项目 ======
export const Slide2: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// problem</Kicker>
      <SlideTitle delay={5}>
        AI CLI 工具 + 第三方模型<br/>= <span style={{ color: "#DC2626" }}>图片理解真空地带</span>
      </SlideTitle>
      <Grid cols={3} gap={30}>
        <Card title="模型不支持多模态" delay={20} accentColor="#DC2626">
          DeepSeek 等第三方模型看不懂图片，收到 base64 数据直接报错或胡言乱语。
          <div style={{ marginTop: 12 }}><Tag delay={35} color="#DC2626">❌ 对话腐烂</Tag></div>
        </Card>
        <Card title="CLAUDE.md 拦不住" delay={25} accentColor="#D97706">
          Claude Code 系统层硬编码了 read 指令，优先级高于 MD 文件规则。
          <div style={{ marginTop: 12 }}><Tag delay={40} color="#D97706">⚠️ 规则无效</Tag></div>
        </Card>
        <Card title="工作流完全错位" delay={30} accentColor="#DC2626">
          截图→粘贴才是最自然的工作流。传统方案要求"先保存为文件"，不符合习惯。
          <div style={{ marginTop: 12 }}><Tag delay={45} color="#DC2626">❌ 体验断裂</Tag></div>
        </Card>
      </Grid>
    </SlideBackground>
  );
};

// ====== Slide 3: 传统方案的死结 ======
export const Slide3: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// root cause</Kicker>
      <SlideTitle delay={5}>
        系统硬编码 read 指令，<br/>你的规则根本<span style={{ color: "#DC2626" }}>拦不住它</span>
      </SlideTitle>
      <SplitLayout
        left={
          <div>
            <SlideSubtitle delay={15}>
              Claude Code 在系统层面硬编码了指令 — 粘贴图片时必定调用 <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#D97706" }}>read</span> 工具，直接把图片发给模型。
            </SlideSubtitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              <Tag delay={25}>系统指令优先级 &gt; CLAUDE.md</Tag>
              <Tag delay={30}>Ctrl+V → base64 → 模型报错</Tag>
              <Tag delay={35}>整段对话就此腐烂，无法继续</Tag>
            </div>
            <AccentBox delay={45}>截图 → 粘贴 → 对话烂掉 → 重新开始{"\n"}(每天上演 N 次)</AccentBox>
          </div>
        }
        right={
          <Screenshot
            src={staticFile("assets/CC-Switch图片整流器/claudecode+DeepSeek关闭图片整流器运行示意图.png")}
            maxHeight={380}
            caption="关闭整流器：对话直接腐烂"
            delay={20}
          />
        }
      />
    </SlideBackground>
  );
};

// ====== Slide 4: 关闭整流器效果（全屏截图） ======
export const Slide4: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// before: rectifier OFF</Kicker>
      <SlideTitle delay={5}>
        关闭整流器：Claude Code + DeepSeek<br/><span style={{ color: "#DC2626" }}>Ctrl+V 后对话直接腐烂</span>
      </SlideTitle>
      <Screenshot
        src={staticFile("assets/CC-Switch图片整流器/claudecode+DeepSeek关闭图片整流器运行示意图.png")}
        maxHeight={400}
        caption="粘贴截图 → 模型收到 base64 → 报错 → 对话无法继续"
        delay={15}
      />
    </SlideBackground>
  );
};

// ====== Slide 5: 本项目的解法 ======
export const Slide5: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// solution</Kicker>
      <SlideTitle delay={5}>
        图片整流器 + 图片分析技能<br/><span style={{ background: "linear-gradient(135deg,#D97706,#B45309 55%,#DC2626)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>两层防线，彻底解决</span>
      </SlideTitle>
      <Grid cols={2} gap={30}>
        <Card title="🛡️ 第一层：图片整流器（代理层）" delay={20}>
          在请求发出前拦截，检测 base64 图片块，移除原始数据，替换为文本提示，引导模型调用 Skill。<strong style={{ color: "#059669" }}>模型看到请求之前就完成了。</strong>
        </Card>
        <Card title="🔧 第二层：图片分析技能（CLI工具）" delay={25} accentColor="#B45309">
          被模型调用后，智能判断图片来源：传了本地路径就读文件，没传路径就从系统剪贴板直接读取。<strong style={{ color: "#B45309" }}>兼容 Claude Code 和 OpenCode。</strong>
        </Card>
      </Grid>
      <FlowSteps steps={["Ctrl+V 粘贴", "整流器拦截", "替换为文本提示", "模型调用 Skill", "✅ 正常返回"]} />
    </SlideBackground>
  );
};

// ====== Slide 6: 对比表 ======
export const Slide6: React.FC<{ animationEndFrame: number }> = () => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();

  const rows = [
    { scene: "Ctrl+V 粘贴到 Claude Code", old: "❌ 系统硬编码 read，直接发给模型，对话烂掉", new: "✅ 整流器在代理层拦截，替换为文本提示，引导模型调用 Skill", oldColor: "#DC2626", newColor: "#059669" },
    { scene: "给定图片文件路径", old: "⚠️ CLAUDE.md 规则勉强可用，但不同 CLI 行为不一致", new: "✅ 整流器统一拦截，不依赖 MD 文件规则", oldColor: "#D97706", newColor: "#059669" },
    { scene: "OpenCode 粘贴剪贴板图片", old: "❌ OpenCode 不生成临时文件，路径都拿不到", new: "✅ Skill 脚本自动检测：有路径读文件，没路径从剪贴板读取", oldColor: "#DC2626", newColor: "#059669" },
    { scene: "多 Provider 切换", old: "❌ 单个模型挂了就挂了", new: "✅ Fallback 机制，30+ Provider 自动切换", oldColor: "#DC2626", newColor: "#059669" },
  ];

  return (
    <SlideBackground>
      <Kicker delay={0}>// comparison</Kicker>
      <SlideTitle delay={5}>传统方案 vs 本项目</SlideTitle>
      <div style={{ marginTop: 20 }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr 2fr", gap: 1, background: "rgba(0,0,0,0.12)", borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
          <div style={{ background: "#D97706", padding: "14px 18px", color: "#FAFAF7", fontSize: 17, fontWeight: 700 }}>场景</div>
          <div style={{ background: "#D97706", padding: "14px 18px", color: "#FAFAF7", fontSize: 17, fontWeight: 700 }}>传统方案</div>
          <div style={{ background: "#D97706", padding: "14px 18px", color: "#FAFAF7", fontSize: 17, fontWeight: 700 }}>本项目</div>
        </div>
        {/* Table rows */}
        {rows.map((row, i) => {
          const delay = 15 + i * 12;
          const progress = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 100 } });
          const opacity = interpolate(progress, [0, 1], [0, 1]);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr 2fr", gap: 1, background: "rgba(0,0,0,0.06)", opacity }}>
              <div style={{ background: "#F2EFE9", padding: "13px 18px", color: "#141413", fontSize: 15, fontWeight: 600 }}>{row.scene}</div>
              <div style={{ background: "#F2EFE9", padding: "13px 18px", color: row.oldColor, fontSize: 14, lineHeight: 1.5 }}>{row.old}</div>
              <div style={{ background: "#F2EFE9", padding: "13px 18px", color: row.newColor, fontSize: 14, lineHeight: 1.5 }}>{row.new}</div>
            </div>
          );
        })}
      </div>
    </SlideBackground>
  );
};

// ====== Slide 7: 启用整流器效果 ======
export const Slide7: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// after: rectifier ON</Kicker>
      <SlideTitle delay={5}>
        启用整流器：图片被<span style={{ color: "#059669" }}>正常拦截</span><br/>并引导调用 Skill
      </SlideTitle>
      <Screenshot
        src={staticFile("assets/CC-Switch图片整流器/claudecode+DeepSeek启用图片整流器运行示意图.png")}
        maxHeight={400}
        caption="同样 Ctrl+V 粘贴 → 整流器拦截 → 替换为文本 → 模型调用 Skill → 正常分析"
        delay={15}
      />
    </SlideBackground>
  );
};

// ====== Slide 8: OpenCode 兼容 ======
export const Slide8: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// opencode compatibility</Kicker>
      <SlideTitle delay={5}>
        OpenCode + DeepSeek<br/><span style={{ color: "#F59E0B" }}>自动从剪贴板读取</span>
      </SlideTitle>
      <SplitLayout
        left={
          <Card title="特殊处理：OpenCode 不生成临时文件" delay={20}>
            Skill 脚本自动检测路径参数：
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
              <Tag delay={30}>有路径 → 读取本地文件</Tag>
              <Tag delay={35} color="#D97706">无路径 → 从系统剪贴板读取</Tag>
            </div>
            <p style={{ marginTop: 12, color: "#4A4845" }}>两种行为自动适配，完美兼容。</p>
          </Card>
        }
        right={
          <Screenshot
            src={staticFile("assets/CC-Switch图片整流器/opencode+DeepSeek运行示意图.png")}
            maxHeight={340}
            caption="Skill 检测到无临时文件，自动从剪贴板读取"
            delay={25}
          />
        }
      />
    </SlideBackground>
  );
};

// ====== Slide 9: 两层防线分工 ======
export const Slide9: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// architecture</Kicker>
      <SlideTitle delay={5}>两层防线的分工</SlideTitle>
      <Grid cols={2} gap={30}>
        <Card title="🛡️ 图片整流器（代理层）" delay={20}>
          <p style={{ color: "#4A4845", marginBottom: 12 }}>在请求发出前拦截</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ListItem delay={30}>检测 messages 中的 base64 图片块</ListItem>
            <ListItem delay={35}>移除原始数据（通常数 MB）</ListItem>
            <ListItem delay={40}>替换为文本提示</ListItem>
            <ListItem delay={45}>引导模型调用 Skill</ListItem>
            <ListItem delay={50} color="#059669"><strong>在模型看到请求之前就完成了</strong></ListItem>
          </div>
        </Card>
        <Card title="🔧 图片分析技能（CLI 工具）" delay={25} accentColor="#B45309">
          <p style={{ color: "#4A4845", marginBottom: 12 }}>被模型调用后执行</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ListItem delay={35} color="#B45309">智能判断图片来源</ListItem>
            <ListItem delay={40} color="#B45309">支持本地文件 / URL / 剪贴板</ListItem>
            <ListItem delay={45} color="#B45309">多图对比（多次 --image）</ListItem>
            <ListItem delay={50} color="#B45309">Fallback：30+ Provider 自动切换</ListItem>
            <ListItem delay={55} color="#B45309"><strong>兼容 Claude Code 和 OpenCode</strong></ListItem>
          </div>
        </Card>
      </Grid>
      <SlideSubtitle delay={65}>
        <span style={{ fontSize: 14, color: "#8A8784" }}>* 目前仅在 Claude Code 和 OpenCode 上经过完整测试，其他 AI CLI 工具理论上也能工作。</span>
      </SlideSubtitle>
    </SlideBackground>
  );
};

// ====== Slide 10: 图片整流器特性 ======
export const Slide10: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// features · rectifier</Kicker>
      <SlideTitle delay={5}>图片整流器 — 关键特性</SlideTitle>
      <Grid cols={2} gap={30}>
        <Card title="1. 自动检测替换" delay={20}>
          自动检测 messages 中的 type: image 块，移除 base64 数据，替换为文本提示。
        </Card>
        <Card title="2. 智能路径提取" delay={25}>
          存在图片缓存引用时，自动提取文件路径拼入提示文本。
        </Card>
        <Card title="3. 可配置 Skill 名称" delay={30}>
          默认调用 image-analysis，可在设置中按需修改为其他 Skill 名称。
        </Card>
        <Card title="4. 无缝配合" delay={35}>
          与图片分析技能形成完整链路，整个过程对用户透明。
        </Card>
      </Grid>
      <SlideSubtitle delay={50}>
        <span style={{ fontSize: 14, color: "#4A4845" }}>配置：路由设置 → 整流器区域 → 打开图片整流器开关 → 填入 Skill 名称</span>
      </SlideSubtitle>
    </SlideBackground>
  );
};

// ====== Slide 11: UI 界面展示 ======
export const Slide11: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// ui · settings</Kicker>
      <SlideTitle delay={5}>整流器开关配置</SlideTitle>
      <SplitLayout
        left={
          <Card title="配置步骤" delay={20}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <ListItem delay={25}>进入 CC Switch → 路由设置</ListItem>
              <ListItem delay={30}>打开 <strong>本地路由总开关</strong></ListItem>
              <ListItem delay={35}>打开 <strong>Claude Code 路由开关</strong></ListItem>
              <ListItem delay={40}>向下滑动找到整流器区域</ListItem>
              <ListItem delay={45}>打开 <strong>整流器总开关</strong></ListItem>
              <ListItem delay={50}>打开 <strong>图片整流器</strong>开关</ListItem>
              <ListItem delay={55}>填入 Skill 名称：image-analysis</ListItem>
            </div>
          </Card>
        }
        right={
          <Screenshot
            src={staticFile("assets/CC-Switch图片整流器/图片整流器开关示意图.png")}
            maxHeight={350}
            caption="CC Switch 整流器设置界面"
            delay={25}
          />
        }
      />
    </SlideBackground>
  );
};

// ====== Slide 12: 图片分析技能 ======
export const Slide12: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// features · image-analysis skill</Kicker>
      <SlideTitle delay={5}>图片分析技能 — 核心能力</SlideTitle>
      <Grid cols={3} gap={30}>
        <Card title="多源输入" delay={20}>
          本地图片 (jpg/png/gif/webp/bmp)、网络图片 URL、系统剪贴板 (macOS)。
        </Card>
        <Card title="多图对比" delay={25}>
          支持多次 --image 参数，同时传入多张图片进行对比分析。
        </Card>
        <Card title="智能 Fallback" delay={30}>
          按配置顺序依次尝试所有 Provider，失败自动切换，首个成功结果标注 provider 名后返回。
        </Card>
      </Grid>
      <SlideSubtitle delay={45}>
        预置 <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#D97706" }}>30+</span> AI Provider，覆盖火山引擎、硅基流动、阿里百炼、智谱、商汤等主流平台。
      </SlideSubtitle>
    </SlideBackground>
  );
};

// ====== Slide 13: Provider 表格 ======
export const Slide13: React.FC<{ animationEndFrame: number }> = () => {
  const providers = [
    { name: "火山引擎", models: "豆包 Seed 2.0 Pro / Lite / Mini、Vision 250815" },
    { name: "硅基流动", models: "Qwen3.6-35B-A3B、Qwen3.6-27B" },
    { name: "阿里百炼", models: "Qwen3.6 Plus / Flash、Qwen3.5 Omni、Kimi K2.6、MiniMax M2.5" },
    { name: "智谱", models: "GLM-4.6V-Flash" },
    { name: "商汤", models: "SenseNova-6.7-Flash-Lite" },
  ];

  return (
    <SlideBackground>
      <Kicker delay={0}>// providers · 30+</Kicker>
      <SlideTitle delay={5}>预置 AI Provider</SlideTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }}>
        {providers.map((p, i) => (
          <ProviderCard key={i} name={p.name} models={p.models} delay={15 + i * 8} />
        ))}
        <ProviderCard
          name="+ 更多平台持续接入中"
          models="所有平台基本都有免费额度，挑选习惯的平台注册即可"
          delay={55}
          accentColor="#F59E0B"
        />
      </div>
      <SlideSubtitle delay={65}>
        <span style={{ fontSize: 13, color: "#8A8784" }}>配置：复制 config.example.json → config.json → 填入各平台 API Key</span>
      </SlideSubtitle>
    </SlideBackground>
  );
};

// ====== Slide 14: 安装与配置 ======
export const Slide14: React.FC<{ animationEndFrame: number }> = () => {
  return (
    <SlideBackground>
      <Kicker delay={0}>// quick start</Kicker>
      <SlideTitle delay={5}>安装与配置流程</SlideTitle>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 4 }}>
        <StepItem num={1} title="注册 AI Provider 并获取 API Key" desc="挑选习惯的平台注册，填入 config.json" delay={15} />
        <StepItem num={2} title="配置全局 CLAUDE.md" desc="加入禁止直接 read 图片的规则，强制使用 image-analysis Skill" delay={25} />
        <StepItem num={3} title="导入 Skill 到 AI CLI" desc="通过 CC Switch 统一管理，一键开启 image-analysis" delay={35} />
        <StepItem num={4} title="配置路由与整流器（最关键）" desc="打开三层开关：本地路由 → Claude Code 路由 → 图片整流器" delay={45} />
      </div>
      <AccentBox delay={60}>
        git clone https://github.com/piaomiaoguying/cc-switch.git && cd cc-switch && ./dev.sh build
      </AccentBox>
    </SlideBackground>
  );
};

// ====== Slide 15: 结尾 CTA ======
export const Slide15: React.FC<{ animationEndFrame: number }> = () => {
  const frame = useClampedFrame();
  const { fps } = useVideoConfig();

  const ctaProgress = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 60 } });
  const ctaScale = interpolate(ctaProgress, [0, 1], [0.8, 1]);
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1]);

  return (
    <SlideBackground>
      <CenterContent>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 70, color: "#D97706", fontWeight: 800, marginBottom: 16 }}>&lt;/&gt;</div>
        <SlideTitle delay={5}>
          图片整流器，让 Ctrl+V<br/>不再烂对话
        </SlideTitle>
        <SlideSubtitle delay={15}>
          代理层拦截 + CLI 技能分析，两层防线解决 AI CLI 搭配第三方模型的图片理解真空问题。
        </SlideSubtitle>
        <div style={{
          display: "inline-block", background: "linear-gradient(135deg,#D97706,#B45309 55%,#DC2626)",
          color: "#fff", fontSize: 22, fontWeight: 700, padding: "16px 40px", borderRadius: 20,
          marginTop: 24, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.01em",
          transform: `scale(${ctaScale})`, opacity: ctaOpacity,
        }}>
          github.com/piaomiaoguying/cc-switch
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 32 }}>
          <Tag delay={50}>MIT License</Tag>
          <Tag delay={55}>⭐ Star on GitHub</Tag>
          <Tag delay={60}>🐛 Issues Welcome</Tag>
        </div>
        <p style={{ color: "#8A8784", fontSize: 14, marginTop: 32 }}>
          感谢观看 · 欢迎试用和反馈
        </p>
      </CenterContent>
    </SlideBackground>
  );
};
