var Chan = require("../../models/chan");
var Msg = require("../../models/msg");
var Helper = require("../../helper");

module.exports = function(irc, network) {
	var client = this;
	var config = Helper.getConfig();

	irc.on("notice", function(data) {
		// Some servers send notices without any nickname
		if (!data.nick) {
			data.from_server = true;
			data.nick = network.host;
		}

		data.type = Msg.Type.NOTICE;
		handleMessage(data);
	});

	irc.on("action", function(data) {
		data.type = Msg.Type.ACTION;
		handleMessage(data);
	});

	irc.on("privmsg", function(data) {
		data.type = Msg.Type.MESSAGE;
		handleMessage(data);
	});

	function handleMessage(data) {
		// Server messages go to server window, no questions asked
		if (data.from_server) {
			chan = network.channels[0];
		} else {
			var target = data.target;

			// If the message is targeted at us, use sender as target instead
			if (target.toLowerCase() === irc.user.nick.toLowerCase()) {
				target = data.nick;
			}

			var chan = network.getChannel(target);
			if (typeof chan === "undefined") {
				// Send notices that are not targeted at us into the server window
				if (data.type === Msg.Type.NOTICE) {
					chan = network.channels[0];
				} else {
					chan = new Chan({
						type: Chan.Type.QUERY,
						name: target
					});
					network.channels.push(chan);
					client.emit("join", {
						network: network.id,
						chan: chan
					});
				}
			}
		}

		var self = data.nick === irc.user.nick;

		// Self messages are never highlighted
		// Non-self messages are highlighted as soon as the nick is detected
		var highlight = !self && data.message.split(" ").some(function(w) {
			return (w.replace(/^@/, "").toLowerCase().indexOf(irc.user.nick.toLowerCase()) === 0);
		});

		if (chan.id !== client.activeChannel) {
			chan.unread++;

			if (highlight) {
				chan.highlight = true;
			}
		}

		var msg = new Msg({
			type: data.type,
			time: data.time,
			mode: chan.getMode(data.nick),
			from: data.nick,
			text: data.message,
			self: self,
			highlight: highlight
		});
		chan.messages.push(msg);

		if (config.maxHistory >= 0 && chan.messages.length > config.maxHistory) {
			chan.messages.splice(0, chan.messages.length - config.maxHistory);
		}

		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	}
};
