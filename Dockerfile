FROM docker.io/library/node:lts-slim
ENV NODE_ENV=production

# Built 31 Mar 2026, v2

WORKDIR /app

COPY . .

RUN npm ci

RUN mkdir -p /app/db

CMD ["node", "index.js"]
