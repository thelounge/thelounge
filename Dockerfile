FROM node
MAINTAINER cha2maru <cha2maru@suou.waseda.jp>

RUN mkdir /root/work
COPY . /root/work
RUN cd /root/work && \
    npm install && \
    npm run build && \
    npm install -g
RUN mkdir /root/.lounge 
VOLUME ["/root/.lounge"]

# Expose ports.
EXPOSE 9000

ENTRYPOINT ["lounge"]