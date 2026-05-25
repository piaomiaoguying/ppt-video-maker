# 🎬 Remotion PPT 视频工厂

> **输入一个主题，产出三种内容：调研文档 + 交互式 PPT + 自动配音视频。**

你是否厌倦了：录屏讲解 PPT 时口误重录？手动对齐音频和幻灯片的噩梦？做一次内容只能用一个场景？

**这个项目用 AI 全自动完成：主题研究 → PPT 设计 → 语音生成 → 视频渲染。同一份内容，既能读、又能讲、还能发。**

---

## 🔥 一份投入，三种产出

```
                         ┌─── 📄 Markdown 调研文档
                         │    深度研究资料，可阅读、可分享
一个主题 ──── AI 自动化 ──┼─── 🖥️ HTML 演示文稿
                         │    带演讲者模式+提词器，真人直接讲
                         └─── 🎥 MP4 视频文件
                              自动配音+自动对齐动画，发视频平台
```

### 📄 产出 1：MD 调研文档
AI 自动进行联网调研，生成结构化的 Markdown 研究资料——包含背景知识、技术原理、行业分析。可以作为知识库文档直接分享。

### 🖥️ 产出 2：HTML 交互式 PPT
**不只是幻灯片，是完整的演讲工具：**
- 🎤 **演讲者模式**（按 `S` 键）——可拖拽的浮动提词器窗口，实时显示当前页讲稿、下一页预览和计时器
- 🎨 36 套精美主题，一键切肤
- ✨ 47 种入场动画 + 20 种 Canvas 特效
- ⌨️ 完整键盘操控（方向键翻页、F 全屏、O 概览网格）
- 🧑‍🏫 **真人可以直接上台讲**——提词器帮你脱稿，演讲者视图与外接屏幕观众视图通过 `BroadcastChannel` 实时同步

### 🎥 产出 3：自动配音视频
**不需要录音、不需要剪辑，直接发布到视频平台：**
- 🗣️ TTS 自动生成每一页旁白语音
- 🎞️ 画面动画与音频**毫秒级自动对齐**（`ffprobe` 精确测量 + Remotion `<Sequence>` 同步）
- 📤 导出标准 MP4，可直接上传 B站 / YouTube / 抖音 / 视频号

---

## ⚡ 核心技术栈

| 环节 | 技术 | 说明 |
|---|---|---|
| 联网调研 | AI Agent | 自动搜索、整理、撰写 Markdown 研究文档 |
| PPT 创作 | [**html-ppt-skill**](https://github.com/lewislulu/html-ppt-skill) | 36 主题 × 31 布局 × 47 动画，纯 HTML/CSS，带演讲者模式+提词器 |
| 语音合成 | Xiaomi Mimo TTS v2.5 | 自然中文语音，批处理一键生成全部旁白 |
| 音频转录 | Whisper | 自动将音频转为文本，生成字幕/时间轴 |
| 视频渲染 | [**Remotion**](https://remotion.dev) | React 驱动编程式视频，音频同步精确到 0.01 秒 |

---

## 🎯 杀手级特性

### 演讲者模式 + 提词器
HTML PPT 内置专业演讲工具：按 `S` 键弹出浮动窗口，左侧当前幻灯片预览、右侧讲稿脚本、顶部计时器——**真人上台就能讲**。窗口位置和大小通过 `localStorage` 持久化，下次打开保持原位。

### 全自动音画同步
每个幻灯片音频时长通过 `ffprobe` 精确测量，Remotion 的 `<Sequence>` + `<Html5Audio>` 确保画面切换与语音精确对齐。**零手动剪辑。**

### 智能动画定格
```
语音播放中 → 动画流畅展示（弹性入场、交错延迟、缩放平移）
语音结束后 → 画面静止停留，不会无声尴尬
```
`useClampedFrame()` 技术：动画在 5 秒内完成，然后完美定格直到音频播完。

### 36 套主题一键切换
从 `neo-brutalism` 到 `cyberpunk-neon` 到 `xiaohongshu-white`，纯 CSS 变量驱动。换个主题，视频气质完全不同。

### 工程化 TTS 发言稿
801 行的《TTS 发言稿编写指南》——完整的语音工程规范：数字发音规则、年份朗读、URL 避免逐字朗读策略、英语缩写优化、自我检查清单。

---

## 🏗️ 项目结构

```
remotion/
├── my-video/           # Remotion 视频渲染引擎（React + TypeScript）
│   ├── src/
│   │   ├── Root.tsx           # 视频注册入口，动态时长计算
│   │   ├── components/        # 可复用动画组件库
│   │   └── themes/            # 各项目的幻灯片组件
│   └── package.json
├── script/             # Python TTS 音频管道
│   ├── generate_all_speech.py  # 批处理语音生成
│   └── audio_transcriber.py   # Whisper 音频转文字
├── templates/          # TTS 发言稿编写指南（2161行）
├── research/           # 已完成项目的产出物
├── html-ppt-skill/     # HTML PPT AgentSkill（上游依赖）
└── docs/               # 文档
```

---

## 🚀 快速开始

```bash
# 一键启动 Remotion Studio（自动安装依赖 + 启动开发服务器）
# 注意：如果本地没有代理服务，请先编辑 script/start.sh 删除代理配置行
bash script/start.sh

# 生成 TTS 语音（需要配置 API Key）
cd script
python generate_all_speech.py -i ../research/项目名/发言稿.md
```

---

## 🎥 已产出项目

| 项目 | 产出物 |
|---|---|
| **CC-Switch 图片整流器** | MD 调研文档 + HTML 交互式 PPT + ~5 分钟自动配音视频 |
| **PPT 视频制作器教程** | MD 调研文档 + HTML 交互式 PPT + ~6 分钟自动配音视频 |

---

## 📦 依赖的开源项目

- **[html-ppt-skill](https://github.com/lewislulu/html-ppt-skill)** — 36 主题 HTML 演示文稿框架，支持演讲者模式、提词器、Canvas 特效。MIT 协议。
- **[Remotion](https://remotion.dev)** — 用 React 编程式创建视频的框架，支持音频同步、Spring 动画、SSR 渲染。Remotion License。

---

## 📄 协议

MIT
