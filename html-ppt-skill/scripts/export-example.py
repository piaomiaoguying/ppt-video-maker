#!/usr/bin/env python3
"""
html-ppt 项目导出工具
=====================
通用脚本：分析 examples 下任意子项目的依赖，一键完整复制到目标目录。

用法:
  python3 export-example.py                      # 交互式选择项目 + 目标
  python3 export-example.py monthly-review-apr    # 指定项目，交互式输入目标
  python3 export-example.py monthly-review-apr ~/my-folder  # 指定项目和目标

它会:
  1. 解析 index.html 中的 <link>/<script>/<img>/data-themes 等引用
  2. 递归解析被引用的 CSS 文件中的 @import / url() 引用
  3. 跳过外部 URL（CDN 等），保留原样
  4. 将所有文件打包到以项目名命名的根目录下，复制到目标目录
"""

import os
import re
import sys
import shutil
from pathlib import Path
from urllib.parse import urlparse

# ---------- 项目根目录 ----------
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent  # html-ppt-skill 根目录
EXAMPLES_DIR = PROJECT_ROOT / "examples"



def list_projects(examples_dir: Path) -> list[str]:
    """列出 examples 下所有包含 index.html 的子目录"""
    projects = []
    if not examples_dir.is_dir():
        return projects
    for d in sorted(examples_dir.iterdir()):
        if d.is_dir() and (d / "index.html").exists():
            projects.append(d.name)
    return projects


def resolve_ref(href: str, base_dir: Path) -> Path | None:
    """将 HTML/CSS 中的引用路径解析为相对于 PROJECT_ROOT 的绝对路径"""
    if not href or href.startswith("data:"):
        return None
    parsed = urlparse(href)
    if parsed.scheme and parsed.scheme not in ("file", ""):
        return None  # 外部 URL，跳过
    if parsed.netloc:
        return None
    # 相对于引用文件所在目录解析
    resolved = (base_dir / parsed.path).resolve()
    try:
        resolved.relative_to(PROJECT_ROOT)
    except ValueError:
        return None  # 跳到项目外的路径，不复制
    return resolved


def is_external(url: str) -> bool:
    """判断是否为外部资源（CDN 等）"""
    if not url or url.startswith("data:"):
        return False
    parsed = urlparse(url)
    return bool(parsed.scheme and parsed.scheme not in ("file", "")) or bool(parsed.netloc)


def collect_html_refs(html_path: Path) -> dict[str, set[Path]]:
    """
    解析 HTML 文件，返回分类的本地文件引用集合。
    返回值: {"css": set(), "js": set(), "img": set(), "other": set()}
    """
    html_dir = html_path.parent
    content = html_path.read_text(encoding="utf-8")

    refs: dict[str, set[Path]] = {"css": set(), "js": set(), "img": set(), "other": set()}
    externals: list[str] = []

    # 1. <link href="...">
    for m in re.finditer(r'<link[^>]+href="([^"]*)"', content):
        p = resolve_ref(m.group(1), html_dir)
        if p:
            refs["css"].add(p)
        elif is_external(m.group(1)):
            externals.append(m.group(1))

    # 2. <script src="...">
    for m in re.finditer(r'<script[^>]+src="([^"]*)"', content):
        p = resolve_ref(m.group(1), html_dir)
        if p:
            refs["js"].add(p)
        elif is_external(m.group(1)):
            externals.append(m.group(1))

    # 3. <img src="...">
    for m in re.finditer(r'<img[^>]+src="([^"]*)"', content):
        p = resolve_ref(m.group(1), html_dir)
        if p:
            refs["img"].add(p)

    # 4. data-theme-base + data-themes — 运行时主题切换
    theme_base_m = re.search(r'data-theme-base="([^"]*)"', content)
    themes_m = re.search(r'data-themes="([^"]*)"', content)
    if theme_base_m and themes_m:
        theme_base = resolve_ref(theme_base_m.group(1), html_dir)
        if theme_base:
            for theme_name in themes_m.group(1).split(","):
                theme_name = theme_name.strip()
                if theme_name:
                    theme_file = theme_base / f"{theme_name}.css"
                    if theme_file.exists():
                        refs["css"].add(theme_file)

    # 5. 当前页面通过 <link> 直接引用的主题文件（作为 CSS 的一部分已收集）
    # 同时也检查 data-theme 属性 — 页面初始主题
    data_theme_m = re.search(r'data-theme="([^"]*)"', content)
    if data_theme_m and theme_base_m:
        theme_base = resolve_ref(theme_base_m.group(1), html_dir)
        if theme_base:
            theme_file = theme_base / f"{data_theme_m.group(1).strip()}.css"
            if theme_file.exists():
                refs["css"].add(theme_file)

    return refs, externals


def collect_css_refs(css_path: Path) -> set[Path]:
    """
    解析 CSS 文件，收集其中 @import 和 url() 引用的本地文件。
    """
    css_dir = css_path.parent
    refs: set[Path] = set()

    try:
        content = css_path.read_text(encoding="utf-8")
    except Exception:
        return refs

    # @import url("...") 或 @import "..."
    for m in re.finditer(r'''@import\s+(?:url\(["']?)?["']([^"')]+)["']''', content):
        p = resolve_ref(m.group(1), css_dir)
        if p and p.suffix in (".css", ".woff2", ".woff", ".ttf", ".otf"):
            refs.add(p)

    # url("...") — 字体、图片等
    for m in re.finditer(r'''url\(["']?([^"')]+)["']?\)''', content):
        p = resolve_ref(m.group(1), css_dir)
        if p:
            refs.add(p)

    return refs


def collect_all_deps(html_path: Path) -> tuple[dict[str, set[Path]], list[str]]:
    """
    收集 HTML 及其所有间接引用文件的完整依赖图。
    递归处理 CSS 中的 @import/url()。
    """
    refs, externals = collect_html_refs(html_path)

    visited: set[Path] = set()

    def resolve_css_chain(css_set: set[Path]):
        stack = list(css_set)
        while stack:
            css = stack.pop()
            if css in visited:
                continue
            visited.add(css)
            subs = collect_css_refs(css)
            for s in subs:
                if s not in visited:
                    if s.suffix in (".css",):
                        stack.append(s)
                    else:
                        refs["other"].add(s)

    resolve_css_chain(refs["css"])

    return refs, externals


def copy_tree(file_set: set[Path], source_root: Path, target_root: Path) -> int:
    """将文件集合按相对路径从 source_root 复制到 target_root，返回复制成功数"""
    count = 0
    for src in sorted(file_set):
        if not src.exists():
            continue
        rel = src.relative_to(source_root)
        dst = target_root / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        count += 1
    return count


def main():
    examples_dir = EXAMPLES_DIR

    # ----- 解析参数 -----
    args = sys.argv[1:]
    project_name: str | None = None
    dest: Path | None = None

    if len(args) >= 1:
        project_name = args[0]
    if len(args) >= 2:
        dest = Path(args[1]).expanduser().resolve()

    # ----- 选择项目 -----
    projects = list_projects(examples_dir)
    if not projects:
        print("错误: examples 目录下没有找到包含 index.html 的项目")
        sys.exit(1)

    if project_name is None:
        print("可用项目:")
        for i, p in enumerate(projects, 1):
            print(f"  {i}. {p}")
        try:
            choice = input("请选择项目编号 (或直接输入项目名): ").strip()
        except (KeyboardInterrupt, EOFError):
            print()
            sys.exit(0)
        if choice.isdigit():
            idx = int(choice) - 1
            if 0 <= idx < len(projects):
                project_name = projects[idx]
        else:
            project_name = choice
    else:
        # 支持模糊匹配：输入路径如 examples/xxx 自动提取
        project_name = Path(project_name).name

    if project_name not in projects:
        print(f"错误: 项目 '{project_name}' 不存在")
        print(f"可用: {', '.join(projects)}")
        sys.exit(1)

    # ----- 目标目录 -----
    if dest is None:
        default_dest = Path.home() / "Downloads"
        try:
            raw = input(f"目标目录 [默认: {default_dest}]: ").strip()
        except (KeyboardInterrupt, EOFError):
            print()
            sys.exit(0)
        dest = Path(raw).expanduser().resolve() if raw else default_dest

    # 所有文件统一收敛到 dest/<project_name>/ 下
    dest = dest / project_name

    # ----- 开始分析 -----
    html_path = examples_dir / project_name / "index.html"
    print(f"\n项目: {project_name}")
    print(f"HTML : {html_path.relative_to(PROJECT_ROOT)}")
    print(f"目标: {dest}")
    print()

    print("正在分析依赖...")
    refs, externals = collect_all_deps(html_path)

    # 补充：项目目录下的非 HTML 本地文件（如 style.css、pic/ 下被 <img> 引用的图片）
    # 前面已通过 HTML 解析收集了 <img>/<link>/<script> 引用
    # 但也扫描项目目录下所有文件，把未被显式引用但存在的资源也带上
    project_dir = examples_dir / project_name
    for f in project_dir.rglob("*"):
        if f.is_file() and f.name != ".DS_Store":
            refs.setdefault("other", set()).add(f)

    # 汇总所有需要复制的文件
    all_files: set[Path] = set()
    for cat in ("css", "js", "img", "other"):
        all_files.update(refs.get(cat, set()))

    # 过滤：排除 copy-ppt.py 自身和 copy-ppt.sh
    all_files = {f for f in all_files if f.name not in ("copy-ppt.py", "copy-ppt.sh")}

    # 分类统计
    css_count = len(refs.get("css", set()))
    js_count = len(refs.get("js", set()))
    img_count = len(refs.get("img", set()))
    other_count = len(refs.get("other", set()))

    print(f"发现 {len(all_files)} 个文件需要复制:")
    print(f"  CSS  : {css_count}")
    print(f"  JS   : {js_count}")
    print(f"  图片  : {img_count}")
    print(f"  其他  : {other_count}")

    if externals:
        print(f"\n外部资源 (保留原 URL，不复制):")
        for url in sorted(set(externals)):
            print(f"  → {url}")

    # 确认：只检查 dest 目录是否已存在，不清空父目录
    if dest.exists():
        try:
            ans = input(f"\n目标中已存在 {project_name}/，是否覆盖? [y/N]: ").strip().lower()
        except (KeyboardInterrupt, EOFError):
            print()
            sys.exit(0)
        if ans not in ("y", "yes"):
            print("已取消")
            sys.exit(0)
        shutil.rmtree(dest)

    # ----- 复制 -----
    print("\n正在复制...")
    total = copy_tree(all_files, PROJECT_ROOT, dest)

    # 输出目录树
    print(f"\n复制完成 ({total} 个文件)")
    print(f"\n目标目录结构:")
    print_tree(dest, dest)

    # 入口文件
    idx_rel = html_path.relative_to(PROJECT_ROOT)
    entry = dest / idx_rel
    print(f"\n浏览器打开入口:")
    print(f"  open \"{entry}\"")

    # 外部依赖提醒
    if externals:
        print(f"\n注意: 有 {len(set(externals))} 个外部资源需要网络访问")


def print_tree(root: Path, base: Path, prefix: str = ""):
    """打印精简目录树"""
    entries = sorted([e for e in root.iterdir() if not e.name.startswith(".")],
                     key=lambda x: (x.is_file(), x.name))
    for i, entry in enumerate(entries):
        is_last = i == len(entries) - 1
        branch = "└── " if is_last else "├── "
        rel = entry.relative_to(base)
        print(f"{prefix}{branch}{entry.name}{'/' if entry.is_dir() else ''}")
        if entry.is_dir():
            next_prefix = prefix + ("    " if is_last else "│   ")
            print_tree(entry, base, next_prefix)


if __name__ == "__main__":
    main()
