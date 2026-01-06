FROM node:22-alpine AS builder

RUN apk add --no-cache \
    python3 \
    py3-setuptools \
    make \
    g++ \
    sqlite

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=false

COPY . .

RUN NODE_ENV=production yarn build

# Install production dependencies in builder stage where build tools are available
RUN rm -rf node_modules && yarn install --frozen-lockfile --production=true

FROM node:22-alpine

RUN apk add --no-cache sqlite

WORKDIR /app

COPY package.json yarn.lock ./

# Copy production node_modules from builder (already built with native modules)
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/index.js ./
RUN echo "/data" > /app/.thelounge_home
COPY --from=builder /app/client/index.html.tpl ./client/index.html.tpl
COPY --from=builder /app/defaults/ ./defaults/
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/public/ ./public/

RUN mkdir -p /data

EXPOSE 80

CMD ["node", "index", "start"]
