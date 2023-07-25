FROM node:lts

EXPOSE 3000 4000 5555

WORKDIR /workspace/back

RUN apt-get update \
	&& npm i -g @nestjs/cli

ENTRYPOINT ["bash", "entrypoint.sh"]
