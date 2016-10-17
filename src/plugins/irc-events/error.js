"use strict";

var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;

	irc.on("irc error", function(data) {
		var text = data.error;
		if (data.reason) {
			text = data.reason + " (" + text + ")";
		}
		var lobby = network.channels[0];
		var msg = new Msg({
			type: Msg.Type.ERROR,
			text: text,
		});
		lobby.pushMessage(client, msg, true);
	});

	irc.on("nick in use", function(data) {
		var lobby = network.channels[0];
		var msg = new Msg({
			type: Msg.Type.ERROR,
			text: data.nick + ": " + (data.reason || "Nickname is already in use."),
		});
		lobby.pushMessage(client, msg, true);

		if (irc.connection.registered === false) {
			var random = (data.nick || irc.user.nick) + Math.floor(10 + (Math.random() * 89));
			irc.changeNick(random);
		}

		client.emit("nick", {
			network: network.id,
			nick: irc.user.nick
		});
	});

	irc.on("nick invalid", function(data) {
		var lobby = network.channels[0];
		var msg = new Msg({
			type: Msg.Type.ERROR,
			text: data.nick + ": " + (data.reason || "Nickname is invalid."),
		});
		lobby.pushMessage(client, msg, true);

		if (irc.connection.registered === false) {
			var random = "i" + Math.random().toString(36).substr(2, 10); // 'i' so it never begins with a number
			irc.changeNick(random);
		}

		client.emit("nick", {
			network: network.id,
			nick: irc.user.nick
		});
	});
};
