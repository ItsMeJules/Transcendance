FROM node:lts

EXPOSE 3000 4000 5555

WORKDIR /workspace/back

RUN apt-get update \
	&& npm i -g @nestjs/cli

# RUN apt-get install nginx
COPY package*.json ./

# RUN apt-get install nginx


RUN npm install

ENTRYPOINT ["bash", "entrypoint.sh"]
