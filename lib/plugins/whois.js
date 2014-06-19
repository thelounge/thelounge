var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(client, sockets) {
	var network = this;
	client.on("whois", function(err, data) {
		if (!data) {
			return;
		}
		var chan = _.findWhere(network.channels, {name: data.nickname});
		if (typeof chan === "undefined") {
			chan = new Chan({
				type: "query",
				name: data.nickname,
			});
			network.addChan(chan);
			sockets.in("chat").emit("join", {
				id: network.id,
				chan: chan,
			});
		}
		var prefix = {
			hostname: "from",
			realname: "is",
			channels: "on",
			server: "using",
		};
		var i = 0;
		for (var k in data) {
			var key = prefix[k];
			if (!key || data[k].toString() == "") {
				continue;
			}
			var msg = new Msg({
				type: "whois",
				from: data.nickname,
				text: key + " " + data[k],
			});
			chan.addMsg(msg);
			sockets.in("chat").emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
		var msg = new Msg({
			type: "whois",
			from: data.nickname,
			text: "End of /WHOIS list.",
		});
		chan.addMsg(msg);
		sockets.in("chat").emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
