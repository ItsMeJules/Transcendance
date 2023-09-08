FROM node:lts AS builder

WORKDIR /workspace/front

COPY package.json ./
COPY entrypoint.sh .
COPY src .

RUN npm install

RUN npm install typescript --save-dev

RUN npm install react-scripts --save


# CMD ["bash", "entrypoint.sh"]
