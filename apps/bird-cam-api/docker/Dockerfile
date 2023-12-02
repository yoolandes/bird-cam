FROM node:18.15.0-alpine3.17
ENV NODE_ENV=production

WORKDIR /home

RUN apk add  --no-cache ffmpeg
RUN apk add  --no-cache python3
RUN apk add --no-cache make
RUN apk add --no-cache g++
COPY package*.json ./
RUN npm install --force
ENV PATH /home/node_modules/.bin:$PATH

WORKDIR /home/app


CMD [ "node", "main.js" ]

