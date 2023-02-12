FROM node:18.13.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY . .

CMD [ "npm", "start" ]
