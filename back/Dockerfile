FROM node:lts

WORKDIR /workspace/back

RUN apt-get update \
	&& npm i -g @nestjs/cli

COPY . .

RUN npm install

ENTRYPOINT ["bash", "entrypoint.sh"]
