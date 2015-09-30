var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("errors", function(data) {
		var lobby = network.channels[0];
		var msg = new Msg({
			type: Msg.Type.ERROR,
			text: data.message,
		});
		client.emit("msg", {
			chan: lobby.id,
			msg: msg
		});
		if (!network.connected) {
			if (data.cmd === "ERR_NICKNAMEINUSE") {
				var random = irc.me + Math.floor(10 + (Math.random() * 89));
				irc.nick(random);
			}
		}
	});
};
