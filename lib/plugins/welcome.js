var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(client, sockets) {
	var network = this;
	client.on("welcome", function(data) {
		network.connected = true;
		var chan = network.channels[0];
		var msg = new Msg({
			from: "-!-",
			text: "You're now known as " + data,
		});
		chan.addMsg(msg);
		sockets.in("chat").emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
