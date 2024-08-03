FROM ghcr.io/puppeteer/puppeteer:22

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

CMD [ "npm", "start" ]
