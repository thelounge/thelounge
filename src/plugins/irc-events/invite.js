var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("invite", function(data) {
		var target = data.to;
		if (target.toLowerCase() === irc.me.toLowerCase()) {
			target = "you";
		}

		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			chan = network.channels[0];
		}

		var msg = new Msg({
			type: Msg.Type.INVITE,
			from: data.from,
			target: target,
			text: data.channel
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
