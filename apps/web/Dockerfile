# syntax=docker/dockerfile:1.4

# --------------------------------------------------------------------------------------------
# Base
# --------------------------------------------------------------------------------------------
FROM node:25-alpine AS base
RUN apk add --no-cache libc6-compat curl tzdata openssl ca-certificates

RUN npm install -g pnpm@10.33.4

# --------------------------------------------------------------------------------------------
# Install dependencies only when needed
# --------------------------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json ./apps/web/
COPY packages ./packages

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# --------------------------------------------------------------------------------------------
# Build app only when needed
# --------------------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json ./
COPY apps/web ./apps/web

ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

RUN pnpm --filter @acme/web exec prisma generate
RUN --mount=type=cache,id=next-cache,target=/app/apps/web/.next/cache \
    pnpm --filter @acme/web build

# --------------------------------------------------------------------------------------------
# Production stage
# --------------------------------------------------------------------------------------------
FROM base AS production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["node", "apps/web/server.js"]
