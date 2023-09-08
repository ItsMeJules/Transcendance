FROM node:lts AS builder

WORKDIR /workspace/front

COPY . .

RUN npm install

RUN npm install typescript --save-dev

RUN npm install react-scripts --save

RUN npm run build

# CMD ["bash", "entrypoint.sh"]
