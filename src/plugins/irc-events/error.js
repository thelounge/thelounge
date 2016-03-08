var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("irc_error", function(data) {
		console.log(data);
		var lobby = network.channels[0];
		var msg = new Msg({
			type: Msg.Type.ERROR,
			text: data.error,
		});
		client.emit("msg", {
			chan: lobby.id,
			msg: msg
		});
	});

	irc.on("nick in use", function(data) {
		var lobby = network.channels[0];
		var msg = new Msg({
			type: Msg.Type.ERROR,
			text: "Nickname " + data.nick + " is already in use: " + data.reason,
		});
		client.emit("msg", {
			chan: lobby.id,
			msg: msg
		});

		var random = irc.user.nick + Math.floor(10 + (Math.random() * 89));
		irc.raw("NICK", random);
	});
};
