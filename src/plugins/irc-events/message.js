var _ = require("lodash");
var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("message", function(data) {
		var target = data.to;
		if (target.toLowerCase() == irc.me.toLowerCase()) {
			target = data.from;
		}
		var chan = _.findWhere(network.channels, {name: target});
		if (typeof chan === "undefined") {
			chan = new Chan({
				type: Chan.Type.QUERY,
				name: data.from
			});
			network.channels.push(chan);
			client.emit("join", {
				network: network.id,
				chan: chan
			});
		}
		var type = "";
		var text = data.message;
		if (text.split(" ")[0] === "\u0001ACTION") {
			type = Msg.Type.ACTION;
			text = text.replace(/\u0001|ACTION/g, "");
		}
		text.split(" ").forEach(function(w) {
			if (w.indexOf(irc.me) === 0) type += " highlight";
		});
		var from_me = false
		if (data.from.toLowerCase() == irc.me.toLowerCase() ) {
			from_me = true
		}
		var msg = new Msg({
			type: type || Msg.Type.MESSAGE,
			from: data.from,
			text: text,
			from_me: from_me
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
