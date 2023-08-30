FROM node:lts

EXPOSE 3000

WORKDIR /workspace/back

RUN apt-get update \
	&& npm i -g @nestjs/cli

# RUN apt-get install nginx
# en prod ne mettre que le package-lock.json
COPY package*.json ./
COPY entrypoint.sh .
# COPY package-lock.json ./

# RUN apt-get install nginx

RUN npm install

# COPY . .

ENTRYPOINT ["bash", "entrypoint.sh"]
