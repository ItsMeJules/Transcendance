FROM node:lts


RUN apt-get update

# RUN npm install

WORKDIR /workspace/front


COPY package*.json ./

# RUN apt-get install nginx


RUN npm install

# COPY . .

# RUN npm run build


EXPOSE 4000


ENTRYPOINT ["npm", "start"]