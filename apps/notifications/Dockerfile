FROM node:21-alpine3.18

WORKDIR /app

COPY ../../package*.json ./

RUN npm install

COPY . .

EXPOSE 4001

RUN nx run notifications:serve

RUN npm ci --production
