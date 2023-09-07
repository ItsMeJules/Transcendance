FROM node:lts AS builder

WORKDIR /workspace/front
COPY package*.json ./
RUN npm ci
COPY . .
# RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "build"]
