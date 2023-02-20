FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./

EXPOSE 12000

CMD ["npm", "start"]
