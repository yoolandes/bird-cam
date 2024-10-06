FROM node:lts-bookworm-slim

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    ca-certificates

RUN echo "deb http://archive.raspberrypi.org/debian/ bookworm main" > /etc/apt/sources.list.d/raspi.list \
  && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 82B129927FA3303E

RUN apt-get update && apt-get install -y libcamera-apps-lite v4l-utils

WORKDIR /home

COPY package*.json ./
RUN apt-get install -y  python3
RUN apt-get install -y  make
RUN apt-get install -y  g++
RUN npm install --force
ENV PATH /home/node_modules/.bin:$PATH

WORKDIR /home/app

ENV UDEV=1

CMD [ "node", "main.js" ]

