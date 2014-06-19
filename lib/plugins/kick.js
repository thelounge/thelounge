var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(client, sockets) {
	var network = this;
	client.on("kick", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			return;
		}
		if (data.client == client.me) {
			chan.users = [];
		} else {
			chan.users = _.without(chan.users, _.findWhere(chan.users, {name: data.client}));
		}
		sockets.in("chat").emit("users", {
			id: chan.id,
			users: chan.users,
		});
		var msg = new Msg({
			type: "kick",
			from: data.nick,
			text: data.client,
		});
		chan.addMsg(msg);
		sockets.in("chat").emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
