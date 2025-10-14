
FROM node:20-alpine

# 安装pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 优先复制依赖管理文件
COPY pnpm-lock.yaml .
COPY package.json .

# 安装依赖（使用--frozen-lockfile保证一致性）
RUN pnpm install --frozen-lockfile

# 复制源码并构建
COPY . .
RUN pnpm run build

# 进去example目录
CMD ["cd", "example", "&&", "npm", "run", "build"]



