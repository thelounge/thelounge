var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("nick", function(data) {
		var self = false;
		var nick = data["new"];
		if (nick === irc.me) {
			var lobby = network.channels[0];
			var msg = new Msg({
				text: "You're now known as " + nick,
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
				nick: nick
			});
		}
		network.channels.forEach(function(chan) {
			var user = _.findWhere(chan.users, {name: data.nick});
			if (typeof user === "undefined") {
				return;
			}
			user.name = nick;
			chan.sortUsers();
			client.emit("users", {
				chan: chan.id,
				users: chan.users
			});
			var msg = new Msg({
				type: Msg.Type.NICK,
				from: data.nick,
				text: nick,
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
