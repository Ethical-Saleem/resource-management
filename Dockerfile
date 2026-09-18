# Debian-based, not Alpine: @nuxt/image's optional `ipx` dependency pulls in
# sharp, and sharp's prebuilt binaries are far more reliably available for
# glibc (this image) than for Alpine's musl libc — on Alpine, npm silently
# skips installing ipx rather than failing, and the app only breaks at
# runtime when Nitro's built server tries to import it.
FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
