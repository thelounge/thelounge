var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("kick", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			return;
		}
		if (data.client == irc.me) {
			chan.users = [];
		} else {
			chan.users = _.without(chan.users, _.findWhere(chan.users, {name: data.client}));
		}
		client.emit("users", {
			chan: chan.id,
			users: chan.users
		});
		var msg = new Msg({
			type: Msg.Type.KICK,
			from: data.nick,
			text: data.client
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
