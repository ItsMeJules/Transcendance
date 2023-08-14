FROM node:lts AS builder

WORKDIR /workspace/front
COPY package*.json ./
RUN npm install react-scripts@latest
RUN npm i
# RUN npm ci
# COPY . .
# RUN npm run build


CMD ["npm", "run", "start"]
