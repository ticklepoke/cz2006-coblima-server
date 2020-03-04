FROM node:10

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production --silent

COPY . .

EXPOSE 5000

CMD ["npm", "start"]