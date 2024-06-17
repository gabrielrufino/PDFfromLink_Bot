FROM ghcr.io/puppeteer/puppeteer:16.1.0

WORKDIR /app

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./
RUN npm ci --only=production
COPY . .

CMD [ "npm", "start" ]
