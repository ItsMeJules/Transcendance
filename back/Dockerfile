FROM node:lts

EXPOSE 3000

WORKDIR /workspace/back

RUN apt-get update \
	&& npm i -g @nestjs/cli

# en prod ne mettre que le package-lock.json
COPY package*.json ./
# COPY package-lock.json ./

RUN npm install

ENTRYPOINT ["bash", "entrypoint.sh"]
