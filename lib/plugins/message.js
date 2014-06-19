var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");
var Network = require("../models/network");

module.exports = function(client, sockets) {
	var network = this;
	client.on("message", function(data) {
		var target = data.to;
		var chan = _.findWhere(network.channels, {name: target.charAt(0) == "#" ? target : data.from});
		if (typeof chan === "undefined") {
			chan = new Chan({
				name: data.from,
				type: "query",
			});
			network.addChan(chan);
			sockets.in("chat").emit("join", {
				id: network.id,
				chan: chan,
			});
		}
		var type = "";
		var text = data.message;
		if (text.split(" ")[0] === "\u0001ACTION") {
			type = "action";
			text = text.replace(/\u0001|ACTION/g, "");
		}
		text.split(' ').forEach(function(w) {
			if (w.indexOf(client.me) == 0) type += " highlight";
		});
		var msg = new Msg({
			type: type || "normal",
			from: data.from,
			text: text,
		});
		chan.addMsg(msg);
		sockets.in("chat").emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
