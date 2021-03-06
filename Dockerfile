FROM node:12.20.1-alpine3.12

LABEL maintainer="Chris Kalmar <christian.kalmar@gmail.com>"

COPY . /app
COPY package.json /app
COPY yarn.lock /app

WORKDIR /app

RUN yarn install --production \
  && yarn cache clean \
  && yarn build

EXPOSE 3000
CMD yarn start
