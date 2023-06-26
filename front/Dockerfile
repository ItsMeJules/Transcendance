FROM node:lts

EXPOSE 3000 4000

RUN apt-get update

WORKDIR /workspace/front

COPY . .

RUN npm install && npm install axios

ENTRYPOINT ["bash", "entrypoint.sh"]