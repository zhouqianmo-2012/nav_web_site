# 使用Node.js最新LTS版本作为基础镜像
FROM node:20-alpine AS base

# 配置NPM镜像源为npmmirror
RUN npm config set registry https://registry.npmmirror.com

# 替换为阿里云的Alpine镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装系统依赖
RUN apk update && apk add --no-cache \
    curl \
    wget \
    git \
    bash \
    tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci

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
