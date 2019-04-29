FROM node:latest

WORKDIR /usr/back

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
