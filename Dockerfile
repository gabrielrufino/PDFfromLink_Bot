FROM node:18.16.0-alpine

WORKDIR /app

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./
RUN npm ci --only=production
COPY . .

CMD [ "npm", "start" ]
