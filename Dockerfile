FROM docker.io/library/node:lts-slim
ENV NODE_ENV=production

# Built 20 Oct 2025

WORKDIR /app

COPY . .

RUN npm ci --omit-dev

RUN mkdir -p /app/db

CMD ["node", "index.js"]
