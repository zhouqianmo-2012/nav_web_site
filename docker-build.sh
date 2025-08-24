#!/bin/bash

# 导航网站 Docker 构建脚本
# 使用方法: ./docker-build.sh [tag]

set -e

# 默认标签
TAG=${1:-"nav-web-site:latest"}

echo "🚀 开始构建 Docker 镜像..."
echo "📦 镜像标签: $TAG"

# 构建镜像
docker build -t $TAG .

echo "✅ 镜像构建完成!"
echo "📋 镜像信息:"
docker images | grep nav-web-site

echo ""
echo "🔧 使用方法:"
echo "1. 运行容器: docker run -d -p 3000:3000 --name nav-web-site $TAG"
echo "2. 使用 docker-compose: docker-compose up -d"
echo "3. 查看日志: docker logs nav-web-site"
echo "4. 停止容器: docker stop nav-web-site"
echo "5. 删除容器: docker rm nav-web-site"

echo ""
echo "🌐 访问地址: http://localhost:3000"
