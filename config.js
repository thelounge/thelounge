module.exports = {
  port: 9000,
  theme: "",
  users: {
    "username": {
      password: "",
      nick: "shout",
      realname: "http://github.com/erming/shout",
      log: false,
      networks: [{
        host: "irc.freenode.org",
        port: 6667,
        tls: false,
        onConnect: {
          join: [
            "#shout-irc"
          ]
        }
      }]
    }
  }
};
