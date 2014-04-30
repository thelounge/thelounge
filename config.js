module.exports = {
	port: 9000,
	theme: "",
	defaults: {
		nick: "shout_user",
		realname: "http://github.com/erming/shout",
	},
	networks: [{
		host: "irc.freenode.org",
		port: 6667,
		channels: [
			"#shout-irc",
		],
	}]
};
