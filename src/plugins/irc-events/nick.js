var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("nick", function(data) {
		var self = false;
		if (data.nick === irc.user.nick) {
			var lobby = network.channels[0];
			var msg = new Msg({
				text: "You're now known as " + data.new_nick,
			});
			lobby.messages.push(msg);
			client.emit("msg", {
				chan: lobby.id,
				msg: msg
			});
			self = true;
			client.save();
			client.emit("nick", {
				network: network.id,
				nick: data.new_nick
			});
		}

		network.channels.forEach(function(chan) {
			var user = _.find(chan.users, {name: data.nick});
			if (typeof user === "undefined") {
				return;
			}
			user.name = data.new_nick;
			chan.sortUsers(irc);
			client.emit("users", {
				chan: chan.id
			});
			var msg = new Msg({
				time: data.time,
				type: Msg.Type.NICK,
				mode: chan.getMode(data.new_nick),
				nick: data.nick,
				new_nick: data.new_nick,
				self: self
			});
			chan.messages.push(msg);
			client.emit("msg", {
				chan: chan.id,
				msg: msg
			});
		});
	});
};
