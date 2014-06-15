module.exports = {
  password: "",
  port: 9000,
  defaults: {
    nick: "shout-user",
    realname: "http://github.com/erming/shout",
  },
  messages: 100,
  networks: [{
    host: "irc.freenode.org",
    port: 6667,
    channels: [
      "#shout-irc",
    ],
  }]
};
