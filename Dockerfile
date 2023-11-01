FROM ubuntu:latest
LABEL authors="royal"


COPY ./dist ./app
COPY ./package.json ./app

RUN npm start