var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("topic", function(data) {
		var chan = _.find(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			return;
		}

		var msg = new Msg({
			time: data.time,
			type: Msg.Type.TOPIC,
			mode: (data.nick && chan.getMode(data.nick)) || "",
			from: data.nick,
			text: data.topic,
			self: data.nick === irc.user.nick
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});

		chan.topic = data.topic;
		client.emit("topic", {
			chan: chan.id,
			topic: chan.topic
		});
	});

	irc.on("topicsetby", function(data) {
		var chan = _.find(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			return;
		}

		var msg = new Msg({
			type: Msg.Type.TOPIC_SET_BY,
			mode: chan.getMode(data.nick),
			nick: data.nick,
			when: data.when,
			self: data.nick === irc.user.nick
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
