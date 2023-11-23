FROM node:18.15.0-alpine3.17
ENV NODE_ENV=production

WORKDIR /home

COPY package*.json ./
RUN npm install
ENV PATH /home/node_modules/.bin:$PATH

WORKDIR /home/app
RUN apk add  --no-cache ffmpeg

CMD [ "node", "main.js" ]

