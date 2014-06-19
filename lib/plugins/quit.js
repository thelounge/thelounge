var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(client, sockets) {
	var network = this;
	client.on("quit", function(data) {
		network.channels.forEach(function(chan) {
			var user = _.findWhere(chan.users, {name: data.nick});
			if (!user) {
				return;
			}
			chan.users = _.without(chan.users, user);
			sockets.in("chat").emit("users", {
				id: chan.id,
				users: chan.users,
			});
			var msg = new Msg({
				type: "quit",
				from: data.nick,
			});
			chan.addMsg(msg);
			sockets.in("chat").emit("msg", {
				id: chan.id,
				msg: msg,
			});
		});
	});
};
