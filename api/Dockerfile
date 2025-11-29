# Simple dev-oriented image for the API (Express + ts-node)
FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies first (keeps layers cacheable)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose API port
EXPOSE 8000

# Start server (ts-node/register is required by src/server.js)
CMD ["npm", "start"]
