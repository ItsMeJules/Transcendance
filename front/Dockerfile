FROM node:lts

EXPOSE 3000

RUN apt-get update

RUN npm install

WORKDIR /workspace/front

ENTRYPOINT ["npm", "start"]