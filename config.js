module.exports = {
  password: "",
  port: 9000,
  theme: "",
  defaults: {
    nick: "shout-user",
    realname: "http://github.com/erming/shout",
  },
  networks: [{
    host: "chat.freenode.net",
    port: 6697,
    tls: true,
    onConnect: {
      commands: [""],
      join: [
				"#shout-irc",
			]
    }
  }]
};
