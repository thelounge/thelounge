var _ = require("lodash");
var Chan = require("../../models/chan");
var Msg = require("../../models/msg");
var Helper = require("../../helper");

module.exports = function(irc, network) {
	var client = this;
	var config = Helper.getConfig();

	irc.on("notice", function(data) {
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
		// First, try to find current target
		var chan = _.find(network.channels, {name: data.target});
		if (typeof chan === "undefined") {
			// If current target doesn't exist, try to find by nick
			chan = _.find(network.channels, {name: data.nick});
			// If neither target or nick channels exist, create one for the nick
			if (typeof chan === "undefined") {
				chan = new Chan({
					type: Chan.Type.QUERY,
					name: data.nick
				});
				network.channels.push(chan);
				client.emit("join", {
					network: network.id,
					chan: chan
				});
			}
		}

		// Server messages go to server window
		if (data.from_server) {
			chan = network.channels[0];
		}

		var self = data.nick === irc.user.nick;

		// Self messages are never highlighted
		// Non-self messages are highlighted as soon as the nick is detected
		var highlight = !self && data.msg.split(" ").some(function(w) {
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
			text: data.msg,
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
