var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("kick", function(data) {
		var from = data.nick;
		var chan = _.find(network.channels, {name: data.channel});
		var mode = chan.getMode(from);

		if (typeof chan === "undefined") {
			return;
		}

		if (data.client === irc.user.nick) {
			chan.users = [];
		} else {
			chan.users = _.without(chan.users, _.find(chan.users, {name: data.client}));
		}

		client.emit("users", {
			chan: chan.id
		});

		var msg = new Msg({
			type: Msg.Type.KICK,
			mode: mode,
			from: from,
			target: data.client,
			text: data.message || "",
			self: data.nick === irc.user.nick
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
