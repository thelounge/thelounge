FROM node:4

# Create a non-root user for lounge to run in.
RUN useradd --create-home lounge

# Needed for setup of Node.js
ENV HOME /home/lounge

# Customize this to specify where The Lounge puts its data.
# To link a data container, have it expose /home/lounge/data
ENV LOUNGE_HOME ${HOME}/data
ENV LOUNGE_SRC ${HOME}/src

RUN mkdir -p ${LOUNGE_SRC}
WORKDIR ${LOUNGE_SRC}

COPY . ${LOUNGE_SRC}

RUN chown -R lounge:lounge ${LOUNGE_SRC}

# Drop root.
USER lounge
RUN npm install

# Expose HTTP
ENV PORT 9000
EXPOSE ${PORT}

# Don't use an entrypoint here. It makes debugging difficult.
CMD node index.js --home $LOUNGE_HOME
