var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;

	// TODO: remove later
	irc.on("irc_error", function(data) {
		console.log("Got an irc_error");
		irc.emit("error", data);
	});

	irc.on("error", function(data) {
		console.log("error", data);
		var text = data.error;
		if (data.reason) {
			text = data.reason + " (" + text + ")";
		}
		var lobby = network.channels[0];
		var msg = new Msg({
			type: Msg.Type.ERROR,
			text: text,
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
		irc.changeNick(random);
	});
};
