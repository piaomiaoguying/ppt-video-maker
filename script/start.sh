#!/bin/bash
set -e

cd "$(dirname "$0")/../my-video"

if [ ! -d "node_modules" ]; then
  echo "📦 依赖未安装，正在安装..."
  export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
  npm install
fi

echo "🚀 启动 Remotion Studio..."
npm run dev
