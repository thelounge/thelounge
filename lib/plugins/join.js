var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(client, sockets) {
	var network = this;
	client.on("join", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			chan = new Chan({
				name: data.channel,
			});
			network.addChan(chan);
			sockets.in("chat").emit("join", {
				id: network.id,
				chan: chan,
			});
		}
		var msg = new Msg({
			from: data.nick,
			type: "join",
		});
		chan.addMsg(msg);
		sockets.in("chat").emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
