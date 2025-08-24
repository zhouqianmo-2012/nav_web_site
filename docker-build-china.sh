#!/bin/bash

# 中国大陆优化的Docker构建脚本
# 适用于Coolify等平台部署

set -e

echo "🇨🇳 中国大陆优化Docker构建脚本"
echo "================================"

# 检查网络连接
echo "🔍 检查网络连接..."
if ! ping -c 1 registry.npmmirror.com > /dev/null 2>&1; then
    echo "⚠️  警告: 无法连接到npmmirror.com，可能需要配置代理"
fi

# 设置构建参数
TAG=${1:-"nav-web-site:latest"}
DOCKERFILE=${2:-"Dockerfile"}

echo "📦 构建参数:"
echo "   镜像标签: $TAG"
echo "   Dockerfile: $DOCKERFILE"

# 如果存在中国优化版本，询问是否使用
if [ -f "Dockerfile.china" ] && [ "$DOCKERFILE" = "Dockerfile" ]; then
    echo ""
    echo "🤔 检测到中国优化版Dockerfile，是否使用？"
    echo "   1) 使用标准版 Dockerfile"
    echo "   2) 使用中国优化版 Dockerfile.china"
    read -p "请选择 (1/2，默认1): " choice
    
    case $choice in
        2)
            DOCKERFILE="Dockerfile.china"
            echo "✅ 使用中国优化版 Dockerfile.china"
            ;;
        *)
            echo "✅ 使用标准版 Dockerfile"
            ;;
    esac
fi

echo ""
echo "🚀 开始构建Docker镜像..."

# 构建镜像，添加构建参数
docker build \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --build-arg NPM_REGISTRY=https://registry.npmmirror.com/ \
    -f $DOCKERFILE \
    -t $TAG \
    . || {
    echo ""
    echo "❌ 构建失败！"
    echo ""
    echo "🔧 故障排除建议："
    echo "1. 检查网络连接"
    echo "2. 尝试使用代理："
    echo "   export HTTP_PROXY=http://your-proxy:port"
    echo "   export HTTPS_PROXY=http://your-proxy:port"
    echo "3. 尝试使用中国优化版："
    echo "   ./docker-build-china.sh nav-web-site:latest Dockerfile.china"
    echo "4. 手动修改Dockerfile中的镜像源"
    exit 1
}

echo ""
echo "✅ 镜像构建成功!"
echo "📋 镜像信息:"
docker images | grep nav-web-site | head -5

echo ""
echo "🔧 使用方法:"
echo "1. 本地运行:"
echo "   docker run -d -p 3000:3000 --name nav-web-site -v \$(pwd)/data:/app/data $TAG"
echo ""
echo "2. 使用docker-compose:"
echo "   docker-compose up -d"
echo ""
echo "3. 推送到镜像仓库:"
echo "   docker tag $TAG your-registry.com/nav-web-site:latest"
echo "   docker push your-registry.com/nav-web-site:latest"

echo ""
echo "🌐 访问地址: http://localhost:3000"
echo ""
echo "📝 Coolify部署提示:"
echo "1. 确保Coolify服务器可以访问GitHub仓库"
echo "2. 在Coolify中设置环境变量（如需要）"
echo "3. 配置数据卷挂载: /app/data"
echo "4. 如果构建失败，检查Coolify的构建日志"
