FROM node:latest
ENV NODE_ENV=production

WORKDIR /home

COPY package*.json ./

RUN npm ci --only=production

CMD [ "node", "main.js" ]

