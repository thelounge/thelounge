FROM node:0.12-onbuild
EXPOSE 9000
ENTRYPOINT ["node", "index.js"]
