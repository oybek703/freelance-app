FROM node:21-alpine3.18

WORKDIR /app

COPY ./dist ./

RUN npm install

COPY . .

EXPOSE 4001

CMD ["node", "./dist/main.js"]
