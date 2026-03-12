# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/common/package.json packages/common/
COPY packages/client/package.json packages/client/
COPY packages/server/package.json packages/server/

RUN yarn install --frozen-lockfile

COPY packages/ packages/
COPY scripts/ scripts/
COPY tsconfig.json clientConfig.json ./

ENV NODE_ENV=production
RUN yarn build

# Stage 2: Runtime
FROM node:22-alpine
WORKDIR /app

# Copy bundled server
COPY --from=builder /app/packages/server/dist/ packages/server/dist/
# Copy client static files (index.html, favicons, manifest, built JS/CSS)
COPY --from=builder /app/packages/client/public/ packages/client/public/

# Install only express (the sole externalized dependency in the esbuild bundle)
RUN npm init -y && npm install express@5.1.0

EXPOSE 8080
ENV USE_TLS=false

CMD ["node", "packages/server/dist/index.js"]
