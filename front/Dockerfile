FROM node:lts

EXPOSE 4000

RUN apt-get update

# RUN npm install

WORKDIR /workspace/front

COPY package*.json ./

# RUN apt-get install nginx


RUN npm install


ENTRYPOINT ["npm", "start"]