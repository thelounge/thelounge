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
		var from_me = false
		if (data.nick.toLowerCase() == irc.me.toLowerCase() ) {
			from_me = true
		}
		var msg = new Msg({
			type: Msg.Type.TOPIC,
			from: from,
			text: data.topic,
			from_me: from_me,
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
