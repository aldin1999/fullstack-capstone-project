FROM node:18.12.1-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3060

ENV MONGO_URL=mongodb://mongodb-service:27017
ENV JWT_SECRET=mySuperSecretKey123

CMD ["node", "app.js"]