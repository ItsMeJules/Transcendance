FROM node:lts AS builder

WORKDIR /workspace/front
COPY package*.json ./
RUN npm install react-scripts@latest -g
RUN npm i
# RUN npm ci
COPY . .
# RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]