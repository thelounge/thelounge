var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("motd", function(data) {
		var lobby = network.channels[0];

		if (data.motd) {
			data.motd.split("\n").forEach(function(text) {
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
		}

		if (data.error) {
			var msg = new Msg({
				type: Msg.Type.MOTD,
				text: data.error
			});
			lobby.messages.push(msg);
			client.emit("msg", {
				chan: lobby.id,
				msg: msg
			});
		}
	});
};
