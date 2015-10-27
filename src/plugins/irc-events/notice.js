var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("notice", function(data) {
		var target = data.to;
		if (target.toLowerCase() === irc.me.toLowerCase()) {
			target = data.from;
		}

		var chan = _.findWhere(network.channels, {name: target});
		if (typeof chan === "undefined") {
			chan = network.channels[0];
		}

		var from = data.from || "";
		if (data.to === "*" || data.from.indexOf(".") !== -1) {
			from = "";
		}
		var msg = new Msg({
			type: Msg.Type.NOTICE,
			from: from,
			text: data.message
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
