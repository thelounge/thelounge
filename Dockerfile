#
# Thanks to @Xe for the Dockerfile template
# https://github.com/Shuo-IRC/Shuo/pull/87/files
#

FROM node:4.0-onbuild

# Create a non-root user for shout to run in.
RUN useradd --create-home shout

# Needed for setup of Node.js
ENV HOME /home/shout

# Customize this to specify where Shout puts its data.
# To link a data container, have it expose /home/shout/data
ENV SHOUT_HOME /home/shout/data

# Expose HTTP
EXPOSE 9000

# Drop root.
USER shout

# Don't use an entrypoint here. It makes debugging difficult.
CMD node index.js --home $SHOUT_HOME
