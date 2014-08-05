var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("welcome", function(data) {
		network.connected = true;
		irc.write("PING " + network.host);
		var lobby = network.channels[0];
		var msg = new Msg({
			text: "You're now known as " + data
		});
		lobby.messages.push(msg);
		client.emit("msg", {
			chan: lobby.id,
			msg: msg
		});
	});
};
