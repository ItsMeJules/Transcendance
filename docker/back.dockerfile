FROM node:lts

EXPOSE 3000

RUN apt-get update \
	&& npm i -g @nestjs/cli

WORKDIR /workspace/back

RUN npm install @nestjs/common

ENTRYPOINT ["npm", "run", "start:dev"]