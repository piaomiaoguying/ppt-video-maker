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

**重要：以下步骤必须严格按顺序执行，每一步完成后才能进入下一步。步骤之间不得跳过、合并或重排。步骤 2 涉及用户交互，必须在调研之前完成，确保用户还在电脑前。**

### 步骤 1: 确认主题 + 命名 + 创建目录

确认主题，确保主题名不含空格（Composition ID 只能包含字母/数字/CJK/连字符）。无主题则 `ask_user_question` 询问。

确认后立即创建目录：

```bash
mkdir -p ./research/[主题名]/audio
```

所有后续文件保存在 `./research/[主题名]/` 下，音频在 `audio/` 子目录。

### 步骤 2: 选定 PPT 视觉主题（必须在此步完成，禁止先进入步骤 3）

> 注意：这不是确认内容主题，而是为 PPT 选择视觉风格/配色方案（深色/浅色/效果系等）。

读取 `./html-ppt-skill/references/themes.md` 获取 36 个视觉主题列表。根据内容领域、目标受众、场合调性、观看条件，结合每个主题的 `when to use` 和 `description`，筛选 **至少 7 个**最合适的候选主题（涵盖不同调性：浅色/深色/效果系/设计系等）。

**选择方式**（避免 `ask_user_question` 的 4 选项限制）：直接在对话中列出候选主题表格，包含主题名、调性、适用场景，让用户在聊天中输入选择。用户选定之前不得执行步骤 3。**

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
