FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
run cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/

FROM base
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/db.sqlite ./db.sqlite
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME 0.0.0.0
CMD ["node", "server.js"]