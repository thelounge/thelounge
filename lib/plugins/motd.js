var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(client, sockets) {
	var network = this;
	client.on("motd", function(data) {
		var rows = data.motd;
		var chan = network.channels[0];
		var msg = new Msg({
			type: "motd-toggle",
			from: "-!-"
		});
		chan.addMsg(msg);
		sockets.in("chat").emit("msg", {
			id: chan.id,
			msg: msg,
		});
		rows.forEach(function(text) {
			var msg = new Msg({
				type: "motd",
				from: "-!-",
				text: text,
			});
			chan.addMsg(msg);
			sockets.in("chat").emit("msg", {
				id: chan.id,
				msg: msg,
			});
		});
	});
};
