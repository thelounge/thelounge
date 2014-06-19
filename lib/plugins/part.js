var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(client, sockets) {
	var network = this;
	client.on("part", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channels[0]});
		if (typeof chan === "undefined") {
			return;
		}
		if (data.nick == client.me) {
			network.channels = _.without(network.channels, chan);
			sockets.in("chat").emit("part", {
				id: chan.id,
			});
		} else {
			chan.users = _.without(chan.users, _.findWhere(chan.users, {name: data.nick}));
			sockets.in("chat").emit("users", {
				id: chan.id,
				users: chan.users,
			});
			var msg = new Msg({
				type: "part",
				from: data.nick,
			});
			chan.addMsg(msg);
			sockets.in("chat").emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
	});
};
