# Coolify 部署指南

本文档专门介绍如何在 Coolify 平台部署导航网站项目，特别针对中国大陆用户的网络环境进行了优化。

## 🚀 Coolify 快速部署

### 1. 准备工作

确保你的项目包含以下文件：
- `Dockerfile` 或 `Dockerfile.china`（推荐）
- `.npmrc`（npm镜像源配置）
- `docker-compose.yml`

### 2. 在Coolify中创建应用

1. 登录Coolify控制台
2. 点击"New Resource" → "Application"
3. 选择"Public Repository"
4. 输入GitHub仓库地址
5. 选择分支（通常是main或master）

### 3. 配置构建设置

#### 方法一：使用中国优化版Dockerfile（推荐）

在Coolify的"Build"设置中：
```
Dockerfile Location: Dockerfile.china
```

#### 方法二：设置环境变量

在"Environment Variables"中添加：
```
NPM_CONFIG_REGISTRY=https://registry.npmmirror.com/
HTTP_PROXY=http://your-proxy:port（如果有代理）
HTTPS_PROXY=http://your-proxy:port（如果有代理）
```

### 4. 配置端口和存储

#### 端口配置
- Port: 3000
- Protocol: HTTP

#### 存储卷配置
添加持久化存储：
- Source: `/app/data`
- Destination: 选择或创建一个持久化卷

### 5. 部署

点击"Deploy"按钮开始部署。

## 🇨🇳 中国大陆网络优化

### 常见问题和解决方案

#### 1. Docker镜像拉取超时

**错误信息：**
```
Error response from daemon: Get https://registry-1.docker.io/v2/: net/http: TLS handshake timeout
```

**解决方案：**
1. 使用阿里云镜像：修改Dockerfile第一行
```dockerfile
FROM registry.cn-hangzhou.aliyuncs.com/library/node:20-alpine
```

2. 或在Coolify服务器配置Docker镜像加速器

#### 2. npm包安装失败

**错误信息：**
```
npm ERR! network timeout at: https://registry.npmjs.org/
```

**解决方案：**
1. 确保项目根目录有`.npmrc`文件
2. 使用`Dockerfile.china`
3. 在Coolify中设置环境变量：
```
NPM_CONFIG_REGISTRY=https://registry.npmmirror.com/
```

#### 3. Alpine包管理器失败

**错误信息：**
```
fetch http://dl-cdn.alpinelinux.org/alpine/v3.x/main/x86_64/APKINDEX.tar.gz
```

**解决方案：**
使用中国优化版Dockerfile，已包含阿里云Alpine镜像源。

### 推荐配置

#### Dockerfile选择优先级：
1. `Dockerfile.china`（最推荐）
2. `Dockerfile`（标准版）

#### 环境变量设置：
```bash
NODE_ENV=production
PORT=3000
NPM_CONFIG_REGISTRY=https://registry.npmmirror.com/
```

## 🔧 故障排除

### 查看构建日志

1. 在Coolify控制台中点击应用
2. 进入"Deployments"标签
3. 点击最新的部署记录
4. 查看"Build Logs"

### 常见错误处理

#### 构建超时
```bash
# 在Dockerfile中增加超时设置
RUN npm config set fetch-timeout 600000
```

#### 内存不足
```bash
# 在Coolify中增加构建资源限制
# 或在package.json中添加：
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
}
```

#### 网络连接问题
1. 检查Coolify服务器的网络连接
2. 尝试使用代理（如果可用）
3. 联系Coolify服务提供商

## 📝 部署检查清单

- [ ] 确认使用`Dockerfile.china`
- [ ] 检查`.npmrc`文件存在
- [ ] 设置正确的环境变量
- [ ] 配置数据卷挂载
- [ ] 检查端口配置（3000）
- [ ] 验证GitHub仓库访问权限
- [ ] 查看构建日志确认无错误

## 🌐 访问应用

部署成功后，Coolify会提供一个访问URL，通常格式为：
```
https://your-app-name.your-coolify-domain.com
```

## 📞 获取帮助

如果遇到问题：
1. 查看Coolify构建日志
2. 检查本项目的DOCKER.md文档
3. 在GitHub Issues中报告问题
4. 联系Coolify技术支持
