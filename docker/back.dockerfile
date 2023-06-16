FROM node:lts

EXPOSE 3000

RUN apt-get update \
	&& npm i -g @nestjs/cli

WORKDIR /workspace/back

RUN npm install @nestjs/common \
	&& npm install @nestjs/config \
	&& npm install @nestjs/typeorm typeorm
	&& npm install @hapi/joi @types/hapi__joi

ENTRYPOINT ["npm", "run", "start:dev"]