# Dev-friendly image for React app (CRA)
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# React dev server port
EXPOSE 3000

CMD ["npm", "start"]
