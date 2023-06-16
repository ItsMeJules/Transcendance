FROM node:lts

EXPOSE 3000

RUN apt-get update \
	&& npm i -g @nestjs/cli

WORKDIR /workspace/back

COPY . .

RUN npm install

ENTRYPOINT ["npm", "run", "start:dev"]