FROM docker.io/oven/bun:latest as builder
WORKDIR /app
COPY ./src/main/webapp/package*.json ./src/main/webapp/bun.lockb ./
RUN bun install
COPY ./src/main/webapp .
COPY .env.prod .env
RUN pwd && ls -la > /tmp/build_debug.log
RUN bun run build 2>&1 | tee /tmp/build.log

FROM docker.io/bitnami/nginx:latest
COPY --from=builder /tmp/build*.log /usr/share/nginx/html/
COPY --from=builder /app/dist /usr/share/nginx/html
