FROM node:21-alpine3.18

WORKDIR /app

ADD package*.json ./

RUN npm install

ADD . .

RUN npm run build

EXPOSE 4001

CMD ["node", "./dist/main.js"]
