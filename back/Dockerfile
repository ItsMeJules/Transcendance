FROM node:lts

EXPOSE 3000 5555

# 5555 for npx prisma studio

RUN apt-get update \
	&& npm i -g @nestjs/cli

WORKDIR /workspace/back

COPY . .

RUN npm install && npx prisma generate 

ENTRYPOINT ["npm", "run", "start:dev"]