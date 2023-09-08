FROM node:lts

WORKDIR /workspace/back

RUN apt-get update \
	&& npm i -g @nestjs/cli

COPY package.json ./

COPY entrypoint.sh .

RUN npm install

ENTRYPOINT ["bash", "entrypoint.sh"]
