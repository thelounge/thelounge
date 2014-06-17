module.exports = {
  password: "",
  port: 9000,
  theme: "",
  defaults: {
    nick: "shout-user",
    realname: "http://github.com/erming/shout",
  },
  networks: [{
    host: "irc.freenode.org",
    port: 6667,
    onConnect: {
      commands: [""],
      join: [
				"#shout-irc",
			]
    }
  }]
};
