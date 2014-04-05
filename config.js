module.exports = {
	port: 9000,
	defaults: {
		nick: "t_user",
		realname: "Temp User",
	},
	servers: [{
		host: "irc.freenode.org",
		channels: ["#t_chan"],
	}]
};
