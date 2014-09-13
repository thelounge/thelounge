var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("motd", function(data) {
		var lobby = network.channels[0];
		data.motd.forEach(function(text) {
			var msg = new Msg({
				type: Msg.Type.MOTD,
				text: text
			});
			lobby.messages.push(msg);
			client.emit("msg", {
				chan: lobby.id,
				msg: msg
			});
		});
	});
};
