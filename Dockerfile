FROM cgr.dev/chainguard/node
ENV NODE_ENV=production

# Built 20 Aug 2024

WORKDIR /app

COPY --chown=node:node . .

RUN npm install --omit-dev

CMD ["index.js"]
