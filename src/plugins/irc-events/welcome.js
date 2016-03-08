var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("registered", function(data) {
		network.nick = data.nick;
		var lobby = network.channels[0];
		var msg = new Msg({
			text: "You're now known as " + data.nick
		});
		lobby.messages.push(msg);
		client.emit("msg", {
			chan: lobby.id,
			msg: msg
		});
		client.save();
		client.emit("nick", {
			network: network.id,
			nick: data.nick
		});
	});
};
