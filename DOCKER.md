# Docker 部署指南

本文档介绍如何使用 Docker 部署导航网站项目。

## 🐳 Docker 文件说明

- `Dockerfile` - Docker 镜像构建文件
- `.dockerignore` - Docker 构建时忽略的文件
- `docker-compose.yml` - Docker Compose 配置文件
- `docker-build.sh` - 构建脚本

## 🚀 快速开始

### 方法一：使用 Docker Compose（推荐）

```bash
# 构建并启动服务
docker-compose up -d

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

### 1. 端口冲突

如果端口3000被占用，可以修改映射端口：

```bash
docker run -p 8080:3000 nav-web-site:latest
```

### 2. 权限问题

确保数据目录有正确的权限：

```bash
chmod -R 755 data/
```

### 3. 查看详细日志

```bash
# 查看容器日志
docker logs nav-web-site

# 实时查看日志
docker logs -f nav-web-site

# 进入容器调试
docker exec -it nav-web-site sh
```

### 4. 重新构建镜像

如果代码有更新，需要重新构建：

```bash
# 删除旧镜像
docker rmi nav-web-site:latest

# 重新构建
docker build -t nav-web-site:latest .
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
