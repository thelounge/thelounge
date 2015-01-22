var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("topic", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			return;
		}
		var from = data.nick || chan.name;
		var self = false;
		if (from.toLowerCase() == irc.me.toLowerCase()) {
			self = true;
		}
		var topic = data.topic;
		var msg = new Msg({
			type: Msg.Type.TOPIC,
			mode: chan.getMode(from),
			from: from,
			text: topic,
			self: self
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
		chan.topic = topic
		client.emit("topic", {
			chan: chan.id,
			topic: _.escape(topic)
		});
	});
};
