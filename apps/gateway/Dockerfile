FROM node:21-alpine3.18

WORKDIR /app

COPY ../../package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

RUN nx run gateway:serve

RUN npm ci --production
