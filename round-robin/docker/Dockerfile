FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000
EXPOSE 5001
EXPOSE 5002
EXPOSE 5003

CMD ["node", "index.js"]
