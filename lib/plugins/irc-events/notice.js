var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("notice", function(data) {
		var lobby = network.channels[0];
		var from = data.from || "*";
		if (data.to == "*" || data.from.indexOf(".") !== -1) {
			from = "*";
		}
		var msg = new Msg({
			type: Msg.Type.NOTICE,
			from: from,
			text: data.message
		});
		lobby.messages.push(msg);
		client.emit("msg", {
			chan: lobby.id,
			msg: msg
		});
	});
};
