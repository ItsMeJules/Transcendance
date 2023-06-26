FROM node:lts

EXPOSE 3000 4000 5555

# 5555 for npx prisma studio

RUN apt-get update \
	&& npm i -g @nestjs/cli

WORKDIR /workspace/back

COPY . .

COPY ./DockerUtils/script.sh /workspace/back/entrypoint.sh

RUN npm install && npx prisma generate 

ENTRYPOINT ["bash", "entrypoint.sh"]