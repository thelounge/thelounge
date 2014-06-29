var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("errors", function(data) {
		var msg = new Msg({
			type: Msg.Type.ERROR,
			from: "*",
			text: data.message,
		});
		client.emit("msg", {
			msg: msg
		});
		if (!network.connected) {
			if (data.cmd == "ERR_NICKNAMEINUSE") {
				var random = client.nick + Math.floor(10 + (Math.random() * 89));
				irc.nick(random);
			}
		}
	});
};
