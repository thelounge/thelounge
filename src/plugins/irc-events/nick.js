"use strict";

var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("nick", function(data) {
		let msg;
		var self = false;
		if (data.nick === irc.user.nick) {
			network.setNick(data.new_nick);

			var lobby = network.channels[0];
			msg = new Msg({
				text: "You're now known as " + data.new_nick,
			});
			lobby.pushMessage(client, msg, true);
			self = true;
			client.save();
			client.emit("nick", {
				network: network.id,
				nick: data.new_nick
			});
		}

		network.channels.forEach((chan) => {
			const user = chan.findUser(data.nick);
			if (typeof user === "undefined") {
				return;
			}
			user.nick = data.new_nick;
			chan.sortUsers(irc);
			client.emit("users", {
				chan: chan.id
			});
			msg = new Msg({
				time: data.time,
				from: data.nick,
				type: Msg.Type.NICK,
				mode: chan.getMode(data.new_nick),
				new_nick: data.new_nick,
				self: self
			});
			chan.pushMessage(client, msg);
		});
	});
};
