# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat vips-dev
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

# 1. Install dependencies
FROM base AS deps
COPY package.json ./
RUN pnpm install --no-frozen-lockfile

# 2. Build Strapi v5 Admin & TypeScript Backend
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build && pnpm prune --prod

# 3. Production Runner (Least Privilege non-root `node` user)
FROM node:22-alpine AS runner
RUN apk add --no-cache vips-dev curl
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/config ./config
COPY --from=builder --chown=node:node /app/src ./src

RUN mkdir -p /app/.tmp /app/public/uploads && chown -R node:node /app/.tmp /app/public/uploads

USER node
EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:1337/api/health || exit 1

CMD ["node", "./node_modules/@strapi/strapi/bin/strapi.js", "start"]
