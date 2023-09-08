FROM node:lts AS builder

WORKDIR /workspace/front

COPY package.json ./
COPY entrypoint.sh .

CMD ["bash", "entrypoint.sh"]
