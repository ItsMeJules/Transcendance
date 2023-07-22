FROM node:lts

EXPOSE 3333 5555

# 5555 for npx prisma studio

RUN apt-get update \
	&& npm i -g @nestjs/cli

# RUN npm install

WORKDIR /workspace/back

COPY package*.json ./

RUN npm install 

RUN npx prisma generate 

ENTRYPOINT ["bash", "entrypoint.sh"]