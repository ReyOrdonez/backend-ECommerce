FROM node:22-slim

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install --omit=dev && npm cache clean --force

COPY . ./

EXPOSE 3000
