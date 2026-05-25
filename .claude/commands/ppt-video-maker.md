---
name: ppt-video-maker
description: 从主题调研到PPT视频生成的全流程。联网搜索调研 → 生成调研资料MD → 生成HTML PPT → 生成TTS发言稿 → 生成音频 → 生成Remotion视频。
allowed-tools: web_search, web_fetch, read_file, write_file, replace, run_shell_command, glob, search_file_content, list_directory, ask_user_question, todo_write, todo_read
---

# PPT视频制作器

## 触发方式

- `/ppt-video-maker 主题名称` - 直接执行
- `/ppt-video-maker` - 询问用户主题

## 完整工作流程

**重要：以下步骤必须严格按顺序执行，不得跳过、合并或重排。步骤 2 涉及用户交互，必须在步骤 3 之前完成。**

### 步骤 1: 确认主题 + 命名 + 创建目录

确认主题，确保主题名不含空格（Composition ID 只能包含字母/数字/CJK/连字符）。无主题则 `ask_user_question` 询问。

确认后立即创建目录：

```bash
mkdir -p ./research/[主题名]/audio
```

所有后续文件保存在 `./research/[主题名]/` 下，音频在 `audio/` 子目录。

### 步骤 2: 选定 PPT 视觉主题（必须在此步完成，禁止先进入步骤 3）

读取 `./html-ppt-skill/references/themes.md` 获取 36 个视觉主题列表。根据内容领域、目标受众、场合调性、观看条件，结合每个主题的 `when to use` 和 `description`，筛选 **至少 7 个**最合适的候选主题（涵盖不同调性：浅色/深色/效果系/设计系等）。

在对话中列出候选主题表格（含主题名、调性、适用场景），让用户输入选择。用户选定之前不得执行步骤 3。

筛选原则：
- 禁止条件反射式选蓝紫暗色系 (`tokyo-night`/`dracula`/`catppuccin-mocha`)——这些仅适合纯代码类技术分享
- 正式汇报、学术、教学等长时间观看场景优先浅色系
- 向用户说明每个候选主题的调性和适用场景，帮助用户决策

### 步骤 3: 联网调研（步骤 2 完成后才能执行）

使用 `web_search` 和 `web_fetch` 多角度搜索：主关键词、相关概念、案例实践、最新趋势，记录来源 URL。

若用户提供了官方链接，优先获取链接内容，不足再搜索补充；搜索时可加 `site:` 限定范围。

### 步骤 4: 生成调研资料

保存为 `./research/[主题]/调研资料.md`，结构：概述 → 核心内容 → 案例分析 → 数据支持 → 参考资料（附 URL）。

### 步骤 5: 生成 HTML PPT

**先读取** `./html-ppt-skill/SKILL.md`（了解模板、布局、动画、演讲者模式等），再生成 `./research/[主题]/PPT.html`。

**主题**：使用步骤 2 选定的主题 CSS。

**模板**：从 `templates/full-decks/` 选最接近的打底（推荐 `tech-sharing`、`presenter-mode-reveal`、`pitch-deck`、`product-launch`），或从 `templates/single-page/` 31 种布局按需组合。

**PPT 结构**：封面页 → 目录页 → 内容页（31 种布局）→ 总结页 → 结束页。

**HTML 规范**：
- 每页 `<section class="slide">`，封面加 `is-active`
- 使用 html-ppt class 系统（`.h1` `.h2` `.card` `.grid.g2/.g3` `.kicker` `.lede` `.accent` 等），不手写内联样式
- 颜色用 CSS tokens（`var(--text-1)`），不硬编码
- 引入 `runtime.js`，CSS 路径按文件层级调整到 `../../assets/` 或 `../../../assets/`
- 预留 `<aside class="notes">` 位置给步骤 7

**html-ppt class → Remotion 组件映射**（写 slides.tsx 时使用）：

| html-ppt 元素 | Remotion 写法 |
|--------------|--------------|
| `<section class="slide">` | `<SlideBackground>` 包裹 |
| `<h1 class="h1">` / `.gradient-text` | `<SlideTitle>` |
| `<h2 class="h2">` | `<h2>` 或小号 `<SlideTitle>` |
| `<p class="kicker">` | 顶部小字 `<p>` |
| `<p class="lede">` | `<SlideSubtitle>` |
| `<div class="card">` | `<Card>` |
| `<div class="grid g2/g3/g4">` | `<Grid cols={2/3/4}>` |
| `<span class="accent">` | `<Highlight color="accent">` |
| `<span class="pill">` | `<Tag>` |
| `<div class="quote">` / `<blockquote>` | `<Quote>` |
| `<ul><li>` | `<ListItem>` 逐项 |
| `<div class="flow-diagram">` | `<FlowBox>` + `<FlowArrow>` |
| `<div class="timeline">` / `<table>` | 自定义布局 |

### 步骤 6: 生成 TTS 发言稿

读取 `./templates/TTS发言稿模板.md`，保存为 `./research/[主题]/发言稿.md`。

格式（严格）：
```markdown
## 第N页：标题

[口语化内容]

---
```

要求：中文冒号 `：`，避免网址/代码块，数字口语化，英文缩写解释，每页 150–300 字。

### 步骤 7: 发言稿回写到 HTML PPT

按 `## 第N页：标题` 解析发言稿，在 HTML 第 N 个 `<section class="slide">` 末尾插入：

```html
<aside class="notes">
  <p>发言稿段落...</p>
</aside>
```

格式转换：段落 → `<p>`，加粗 → `<strong>`，斜体 → `<em>`。代码块、`【注释】`、`---` 删除。每页 notes 约 150–300 字。`.notes` 默认 `display:none`，观众不可见。

### 步骤 8: 生成音频

```bash
cd ./script
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt  # 首次
python generate_all_speech.py --input ../research/[主题]/发言稿.md --output ../research/[主题]/audio/
```

输出为 `01_第1页.wav`, `02_第2页.wav` 等。

### 步骤 9: 生成 Remotion 视频

#### 9.1 创建目录并复制音频

```bash
mkdir -p ./my-video/src/themes/[主题名]
mkdir -p ./my-video/public/audio/[主题名]
cp -r ./research/[主题]/audio/* ./my-video/public/audio/[主题名]/
```

**路径一致性**：`./research/[主题名]/audio/` = `./my-video/public/audio/[主题名]/` = audioConfig.ts 中 `audio/[主题名]/xx_第x页.wav`，三处主题名必须一致。

#### 9.2 创建组件文件

```
./my-video/src/themes/[主题名]/
├── index.tsx        # 主组件，导出 videoConfig
├── audioConfig.ts   # 音频路径配置
├── slides.tsx       # 幻灯片组件（参照 PPT.html 设计）
├── components.tsx   # 公共组件（读 html-ppt 主题 CSS 文件提取 token 值，不硬编码）
└── utils.ts         # 工具函数
```

**核心规则**：读取选定的 html-ppt 主题 CSS 文件（`assets/themes/[主题名].css`），提取 `--bg`、`--text-1`、`--accent`、`--border`、`--surface` 等 CSS 变量值，写入 `components.tsx`。

**audioConfig.ts**:
```typescript
audioFile: `audio/[主题名]/${String(index + 1).padStart(2, '0')}_第${index + 1}页.wav`
```

**index.tsx**:
```typescript
export const videoConfig = {
  id: "[主题名]",  // 不含空格，字母/数字/CJK/连字符
  fps: 30, width: 1920, height: 1080,
};
```

#### 9.3 注册 Composition

在 `./my-video/src/Root.tsx` 中添加：
```typescript
import { [主题名]Video, videoConfig as [主题名]Config } from "./themes/[主题名]";

<Composition
  id={[主题名]Config.id}
  component={[主题名]Video}
  durationInFrames={150}
  fps={[主题名]Config.fps}
  width={[主题名]Config.width}
  height={[主题名]Config.height}
  calculateMetadata={calculate[主题名]Metadata}
/>
```

#### 9.4 预览与渲染

启动预览（不自动渲染）：`cd ./my-video && npm run dev`。浏览器 `http://localhost:3000` 选择 Composition 检查效果。满意后手动渲染：

```bash
cd ./my-video && npx remotion render [主题名] out/[主题名].mp4
```

### 步骤 10: 音频动画对齐（可选）

**执行时机**：步骤 9 全部完成后，使用 `ask_user_question` 询问用户：

> 视频已生成完毕，是否需要进行音频与动画的时序对齐（audio-sync）？

用户选择"是"则执行以下流程。

---

#### 预先准备

确保以下文件存在（按约定组织）：

```
my-video/public/audio/<项目名>/     # 音频 .wav 文件，命名为 01_第1页.wav 等
my-video/src/themes/<项目名>/slides.tsx  # 幻灯片组件
my-video/src/themes/<项目名>/audioConfig.ts  # 音频时长配置
research/<项目名>/发言稿.md          # 原始发言稿（全页）
script/audio_transcriber.py        # 音频转文字脚本
```

音频命名规则示例：`03_第3页.wav`，与 `slides.tsx` 中的 `Slide3` 页码对应。

#### 并行执行策略

处理多个页面时，为提升速度，每个页码单独启用一个 subagent。分两轮进行：

**第一轮：并行生成所有转录初稿**

为每一页同时启动 Background Agent，调用 `audio_transcriber.py` 生成转录文件。

```bash
# 每页独立执行
<项目venv>/bin/python script/audio_transcriber.py "<音频文件路径>" "<音频文件所在目录>"
```

转录结果保存为 `.txt`，格式为 `[MM:SS] 文字`，一行一个分段。

**第二轮：并行修正 + 调整动画**

所有转录完成后，为每一页同时启动 Agent（foreground），每个 Agent 负责：
1. 读取该页转录 `.txt` 和 `research/<项目名>/发言稿.md` 中对应页面段落
2. 用发言稿修正转录文字并写回 `.txt`
3. 读取 `slides.tsx` 中该页组件代码
4. 根据时间轴调整所有动画 delay 值
5. 如果这是本轮执行过程中调整的第一页，顺带修改 `audioConfig.ts` 中该页的 `animationDuration` 为 `-1`；如果其他页已经改过则跳过

每个 Agent 的 prompt 必须包含完整的工作规范和该页页码。

#### 步骤 10.1：生成音频转录初稿

调用音频转文字脚本生成转录文件：
```bash
<项目venv>/bin/python script/audio_transcriber.py "<音频文件路径>" "<音频文件所在目录>"
```

转录结果保存为 `.txt`，格式为 `[MM:SS] 文字`，一行一个分段。

#### 步骤 10.2：用发言稿修正转录文字

1. 读取 `research/<项目名>/发言稿.md`，定位到对应页面的段落（用 `## 第X页：` 标题匹配）
2. 对转录文本逐句修正：
  - 将 Whisper 识别错误的词替换为发言稿原文
  - **严格保持时间戳不变**
  - 遇到录音中说话人自行调整了措辞（与发言稿不同），按实际录音为准，不强行对齐发言稿
3. 将修正后的内容写回 `.txt` 文件

#### 步骤 10.3：根据时间轴调整动画 delay

1. 读取 `slides.tsx` 中对应的幻灯片组件代码
2. 在 `audioConfig.ts` 中将该页的 `animationDuration` 设为 `-1`（使用完整音频时长）
3. 将转录文字按时间戳分段，为每段台词分配动画元素，遵循以下规则：

**核心原则**：
- **首动画必须是标题**：幻灯片打开第 0 帧立即显示 `SlideTitle`（`delay={0}`），杜绝空屏
- **动画比音频提前约 500ms**：所有后续动画的 delay 值应该在时间戳对应帧的基础上减去约 15 帧（30fps 下 500ms ≈ 15 帧），让视觉响应先于听觉到达
- **动画顺序与台词对应**：每个动画元素对应一句或一段台词，确保台词说到的时候动画已经就位
- **非关键元素可省略 Kicker**：如果 Kicker 只是装饰性标签且会导致延迟第一帧动画，可以去掉，直接用标题开场

**delay 计算公式**：
```
delay(帧) = max(0, 时间戳秒数 × 30 - 15)
```
式中 `30` 是 fps，`-15` 是 500ms 提前量。首个 `SlideTitle` 强制 `delay={0}` 不做提前。

**动画元素匹配建议**：

| 转录文字关键句 | 推荐动画元素 |
|---|---|
| 标题/主论调 | `SlideTitle` |
| 段落论证 | `SlideSubtitle` 或 `ListItem` |
| 短句要点 | `Tag` 或 `Card` |
| 强调/对比 | `AccentBox` 或 `Highlight` |
| 证据（截图等） | `Screenshot` |

4. 使用 Edit 工具直接修改 `slides.tsx` 中的 delay 值
5. **所有页面处理完毕后**，执行构建验证：

```bash
cd my-video && npx tsc --noEmit src/themes/<项目名>/slides.tsx 2>&1 | head -30
```

如果构建报错，根据错误信息逐条修复后再重新验证，直到构建通过。

常见错误及修复：
- `Expected "}" but found "xxx"` — TSX 语法错误，检查引号、花括号是否配对
- `Unexpected "export"` — 上一步组件缺少闭合的 `};`
- `'}' expected` — 文件末尾缺少空行或组件括号不完整
- `Cannot find name 'xxx'` — 可能是导入缺失或变量未定义

#### 质量检查清单

- [ ] 开场 0 帧无空屏，标题立即可见
- [ ] 每个动画的 delay 值比对应台词时间戳提前约 500ms
- [ ] 最后一句台词的动画不会超出页面时长（`audioDuration × 30` 帧）
- [ ] `audioConfig.ts` 中该页 `animationDuration` 已设为 `-1`
- [ ] 转录 `.txt` 与原发言稿逐句比对修正过
- [ ] 项目构建通过，无 TypeScript 错误

---

## 排障

### node_modules 问题（`@rspack/binding` 找不到）

```bash
cd my-video
rm -rf node_modules package-lock.json
npm install
# 仍不行则：
cp node_modules/@rspack/binding-darwin-x64/rspack.darwin-x64.node node_modules/@rspack/binding/
```

## 相关文件

- `./html-ppt-skill/SKILL.md` - html-ppt 主文档
- `./html-ppt-skill/references/themes.md` - 36 主题目录
- `./html-ppt-skill/references/layouts.md` - 31 种单页布局
- `./html-ppt-skill/references/full-decks.md` - 15 个完整模板
- `./html-ppt-skill/references/presenter-mode.md` - 演讲者模式
- `./html-ppt-skill/references/animations.md` - 动画目录
- `./templates/TTS发言稿模板.md` - TTS 发言稿写作指南
- `./script/generate_all_speech.py` - TTS 音频生成脚本
