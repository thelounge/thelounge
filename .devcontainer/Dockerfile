FROM node:lts-alpine

ENV THELOUNGE_HOME "~/.thelounge"
VOLUME "${THELOUNGE_HOME}"

ENV PORT 9000
EXPOSE ${PORT}

RUN apk --update --no-cache --virtual add git openssh
