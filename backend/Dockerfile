FROM node:18-slim
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package*.json ./
RUN npm install --only=production
COPY --chown=node:node . .
EXPOSE 3000
CMD ["node", "index.js"]