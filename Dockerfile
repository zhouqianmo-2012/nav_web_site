# 使用阿里云的Node.js镜像（中国大陆优化）
FROM registry.cn-hangzhou.aliyuncs.com/library/node:20-alpine AS base

# 如果阿里云镜像不可用，回退到官方镜像
# FROM node:20-alpine AS base

# 替换为阿里云的Alpine镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    sed -i 's/v[0-9]\.[0-9]/latest-stable/g' /etc/apk/repositories

# 配置多个NPM镜像源（提高成功率）
RUN npm config set registry https://registry.npmmirror.com/ && \
    npm config set disturl https://npmmirror.com/dist && \
    npm config set electron_mirror https://npmmirror.com/mirrors/electron/ && \
    npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass/ && \
    npm config set phantomjs_cdnurl https://npmmirror.com/mirrors/phantomjs/

# 安装系统依赖（使用阿里云镜像源）
RUN apk update --no-cache && apk add --no-cache \
    curl \
    wget \
    git \
    bash \
    tzdata \
    ca-certificates \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata \
    && rm -rf /var/cache/apk/*

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 清理npm缓存并安装依赖（使用国内镜像源）
RUN npm cache clean --force && \
    npm ci --registry=https://registry.npmmirror.com/ --no-audit --no-fund

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# 添加非root用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制构建产物和必要文件
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 创建数据目录并设置权限
RUN mkdir -p /app/data/uploads && \
    chown -R nextjs:nodejs /app/data

# 复制初始数据文件（如果存在）
COPY --from=builder --chown=nextjs:nodejs /app/data/*.yml /app/data/ 2>/dev/null || true

# 切换到非root用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# 启动命令
CMD ["node", "server.js"]
