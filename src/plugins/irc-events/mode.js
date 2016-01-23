var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("mode", function(data) {
		var chan = _.findWhere(network.channels, {name: data.target});
		if (typeof chan !== "undefined") {
			setTimeout(function() {
				irc.write("NAMES " + data.target);
			}, 200);
			var from = data.nick;
			if (from.indexOf(".") !== -1) {
				from = data.target;
			}
			var self = false;
			if (from.toLowerCase() === irc.me.toLowerCase()) {
				self = true;
			}
			var msg = new Msg({
				type: Msg.Type.MODE,
				mode: chan.getMode(from),
				from: from,
				text: data.mode + " " + (data.client || ""),
				self: self
			});
			chan.messages.push(msg);
			client.emit("msg", {
				chan: chan.id,
				msg: msg,
			});
		}
	});
};
