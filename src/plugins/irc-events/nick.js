var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("nick", function(data) {
		var self = false;
		if (data["new"] == irc.me) {
			var lobby = network.channels[0];
			var msg = new Msg({
				text: "You're now known as " + data["new"],
			});
			lobby.messages.push(msg);
			client.emit("msg", {
				chan: lobby.id,
				msg: msg
			});
			self = true;
		}
		network.channels.forEach(function(chan) {
			var user = _.findWhere(chan.users, {name: data.nick});
			if (typeof user === "undefined") {
				return;
			}
			user.name = data["new"];
			chan.sortUsers();
			client.emit("users", {
				chan: chan.id,
				users: chan.users
			});
			var msg = new Msg({
				type: Msg.Type.NICK,
				from: data.nick,
				text: data["new"],
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
