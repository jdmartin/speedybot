FROM cgr.dev/chainguard/node
ENV NODE_ENV=production

# Built 22 Sep 2025

# Note: Instead of .env, this uses .env.docker.

WORKDIR /app

COPY --chown=node:node . .

RUN npm install --omit-dev

CMD ["--env-file=.env.docker", "index.js"]
