FROM node:18-alpine

WORKDIR /app

COPY config/config.js ./config.js
COPY config/validateConfig.js ./validateConfig.js
COPY package*.json ./

RUN npm install --omit=dev

CMD ["node", "validateConfig.js"]
