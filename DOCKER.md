# Docker 部署指南

本文档介绍如何使用 Docker 部署导航网站项目。

## 🇨🇳 中国大陆用户特别说明

由于网络环境的特殊性，为中国大陆用户提供了优化版本：

- `Dockerfile` - 标准版Docker镜像构建文件
- `Dockerfile.china` - 中国大陆优化版（推荐）
- `.npmrc` - npm国内镜像源配置
- `docker-build-china.sh` - 中国大陆优化构建脚本

## 🐳 Docker 文件说明

- `Dockerfile` - Docker 镜像构建文件
- `Dockerfile.china` - 中国大陆优化版本
- `.dockerignore` - Docker 构建时忽略的文件
- `docker-compose.yml` - Docker Compose 配置文件
- `docker-build.sh` - 标准构建脚本
- `docker-build-china.sh` - 中国大陆优化构建脚本
- `.npmrc` - npm镜像源配置

## 🚀 快速开始

### 🇨🇳 中国大陆用户（推荐）

```bash
# 使用中国优化版构建脚本
./docker-build-china.sh

# 或使用中国优化版docker-compose
docker-compose --profile china up -d nav-web-site-china

# 或直接使用中国优化版Dockerfile
docker build -f Dockerfile.china -t nav-web-site:china .
```

### 方法一：使用 Docker Compose（推荐）

```bash
# 标准版本
docker-compose up -d

# 中国优化版本
docker-compose --profile china up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 方法二：使用 Docker 命令

```bash
# 构建镜像
docker build -t nav-web-site:latest .

# 运行容器
docker run -d \
  --name nav-web-site \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  nav-web-site:latest

# 查看日志
docker logs -f nav-web-site

# 停止并删除容器
docker stop nav-web-site
docker rm nav-web-site
```

### 方法三：使用构建脚本

```bash
# 使用默认标签构建
./docker-build.sh

# 使用自定义标签构建
./docker-build.sh nav-web-site:v1.0.0
```

## 📁 数据持久化

项目使用本地文件系统存储数据，包括：

- `data/apps.yml` - 应用配置
- `data/config.yml` - 网站配置
- `data/bookmarks.yml` - 书签数据
- `data/uploads/` - 上传的HTML文件

**重要**：为了保证数据不丢失，请确保挂载 `data` 目录：

```bash
-v $(pwd)/data:/app/data
```

## 🔧 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| NODE_ENV | production | 运行环境 |
| PORT | 3000 | 服务端口 |
| HOSTNAME | 0.0.0.0 | 绑定地址 |

## 🏥 健康检查

容器包含健康检查功能：

- 检查间隔：30秒
- 超时时间：30秒
- 重试次数：3次
- 启动等待：5秒

查看健康状态：

```bash
docker ps
# 或
docker inspect nav-web-site | grep Health -A 10
```

## 🔍 故障排除

### 🇨🇳 中国大陆网络问题

#### 1. Docker镜像拉取失败
```bash
# 错误示例：timeout、connection refused
# 解决方案：使用阿里云镜像
FROM registry.cn-hangzhou.aliyuncs.com/library/node:20-alpine

# 或配置Docker镜像加速器
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.cn-hangzhou.aliyuncs.com"
  ]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

#### 2. npm包安装失败
```bash
# 错误示例：ETIMEDOUT、ENOTFOUND
# 解决方案1：使用.npmrc配置
echo "registry=https://registry.npmmirror.com/" > .npmrc

# 解决方案2：使用中国优化版Dockerfile
docker build -f Dockerfile.china -t nav-web-site:china .

# 解决方案3：设置代理（如果有）
export HTTP_PROXY=http://your-proxy:port
export HTTPS_PROXY=http://your-proxy:port
docker build --build-arg HTTP_PROXY=$HTTP_PROXY --build-arg HTTPS_PROXY=$HTTPS_PROXY .
```

#### 3. Alpine包管理器失败
```bash
# 错误示例：apk update失败
# 解决方案：使用阿里云Alpine镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
```

### 🔧 通用问题

#### 1. 端口冲突

如果端口3000被占用，可以修改映射端口：

```bash
docker run -p 8080:3000 nav-web-site:latest
```

#### 2. 权限问题

确保数据目录有正确的权限：

```bash
chmod -R 755 data/
```

#### 3. 查看详细日志

```bash
# 查看容器日志
docker logs nav-web-site

# 实时查看日志
docker logs -f nav-web-site

# 进入容器调试
docker exec -it nav-web-site sh
```

#### 4. 重新构建镜像

如果代码有更新，需要重新构建：

```bash
# 删除旧镜像
docker rmi nav-web-site:latest

# 重新构建（中国用户推荐）
./docker-build-china.sh

# 或标准构建
docker build -t nav-web-site:latest .
```

#### 5. Coolify平台特殊问题

```bash
# 如果在Coolify中构建失败，尝试：
# 1. 检查Coolify服务器的网络连接
# 2. 在Coolify中设置环境变量：
#    HTTP_PROXY=http://your-proxy:port
#    HTTPS_PROXY=http://your-proxy:port
# 3. 使用中国优化版Dockerfile
# 4. 检查Coolify的构建日志获取详细错误信息
```

## 🌐 访问应用

容器启动后，访问：http://localhost:3000

## 📝 注意事项

1. **数据备份**：定期备份 `data` 目录
2. **镜像更新**：代码更新后需要重新构建镜像
3. **网络配置**：如需自定义网络，请修改 docker-compose.yml
4. **资源限制**：生产环境建议设置内存和CPU限制

## 🔄 更新部署

```bash
# 停止当前服务
docker-compose down

# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build
```
