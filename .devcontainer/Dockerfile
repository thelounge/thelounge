FROM node:lts-alpine

ENV THELOUNGE_HOME=/home/node/.thelounge
ENV NODE_MODULES_DIR=/workspaces/thelounge/node_modules
ENV PORT=9000

VOLUME "${THELOUNGE_HOME}"

EXPOSE ${PORT}

RUN apk --update --no-cache --virtual add git openssh

COPY docker-entrypoint.sh .

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
