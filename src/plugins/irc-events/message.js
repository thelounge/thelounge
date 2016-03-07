var _ = require("lodash");
var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("message", function(data) {
		if (data.message.indexOf("\u0001") === 0 && data.message.substring(0, 7) !== "\u0001ACTION") {
			// Hide ctcp messages.
			return;
		}

		var target = data.to;
		if (target.toLowerCase() === irc.me.toLowerCase()) {
			target = data.from;
		}

		var chan = _.find(network.channels, {name: target});
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

		var type = Msg.Type.MESSAGE;
		var text = data.message;
		var textSplit = text.split(" ");
		if (textSplit[0] === "\u0001ACTION") {
			type = Msg.Type.ACTION;
			text = text.replace(/^\u0001ACTION|\u0001$/g, "");
		}

		var highlight = false;
		textSplit.forEach(function(w) {
			if (w.toLowerCase().indexOf(irc.me.toLowerCase()) === 0) {
				highlight = true;
			}
		});

		var self = false;
		if (data.from.toLowerCase() === irc.me.toLowerCase()) {
			self = true;
		}

		if (chan.id !== client.activeChannel) {
			chan.unread++;
		}

		var name = data.from;
		var msg = new Msg({
			type: type,
			mode: chan.getMode(name),
			from: name,
			text: text,
			self: self,
			highlight: highlight
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
