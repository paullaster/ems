# build stage
FROM node:16-alpine AS build-stage

WORKDIR /var/www/Aquila

ARG NPM_TOKEN  
COPY .npmrc .npmrc

COPY package.json ./

RUN npm install

RUN rm -f .npmrc

COPY . .

#RUN npm run build

# production stage
FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY ./dockerfiles/nginx.config /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
