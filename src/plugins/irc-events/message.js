"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");
const LinkPrefetch = require("./link");

module.exports = function(irc, network) {
	var client = this;

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

	irc.on("wallops", function(data) {
		data.from_server = true;
		data.type = Msg.Type.NOTICE;
		handleMessage(data);
	});

	function handleMessage(data) {
		let chan;
		let highlight = false;
		const self = data.nick === irc.user.nick;

		// Server messages go to server window, no questions asked
		if (data.from_server) {
			chan = network.channels[0];
		} else {
			var target = data.target;

			// If the message is targeted at us, use sender as target instead
			if (target.toLowerCase() === irc.user.nick.toLowerCase()) {
				target = data.nick;
			}

			chan = network.getChannel(target);
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

			// Query messages (unless self) always highlight
			if (chan.type === Chan.Type.QUERY) {
				highlight = !self;
			} else if (chan.type === Chan.Type.CHANNEL) {
				const user = chan.findUser(data.nick);

				if (user) {
					user.lastMessage = data.time || Date.now();
				}
			}
		}

		// Self messages in channels are never highlighted
		// Non-self messages are highlighted as soon as the nick is detected
		if (!highlight && !self) {
			highlight = network.highlightRegex.test(data.message);
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

		// No prefetch URLs unless are simple MESSAGE or ACTION types
		if ([Msg.Type.MESSAGE, Msg.Type.ACTION].indexOf(data.type) !== -1) {
			LinkPrefetch(client, chan, msg);
		}

		chan.pushMessage(client, msg, !self);
	}
};
