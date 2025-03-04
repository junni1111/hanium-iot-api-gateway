FROM node:14
MAINTAINER seonghyeon.jee@gmail.com

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 7777


CMD ["npm", "run", "start:prod"]
