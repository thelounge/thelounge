var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("nick", function(data) {
		var self = false;
		if (data.nick === irc.user.nick) {
			var lobby = network.channels[0];
			var msg = new Msg({
				text: "You're now known as " + data.newnick,
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
				nick: data.newnick
			});
		}

		network.channels.forEach(function(chan) {
			var user = _.find(chan.users, {name: data.nick});
			if (typeof user === "undefined") {
				return;
			}
			user.name = data.newnick;
			chan.sortUsers();
			client.emit("users", {
				chan: chan.id
			});
			var msg = new Msg({
				type: Msg.Type.NICK,
				mode: chan.getMode(data.newnick),
				nick: data.nick,
				newnick: data.newnick,
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
