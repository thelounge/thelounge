var config = require("../../config") || {};
var Msg = require("../models/msg");

module.exports = function(client, sockets) {
	var network = this;
	client.on("errors", function(data) {
		sockets.in("chat").emit("msg", {
			msg: new Msg({
				type: "error",
				from: "-!-",
				text: data.message,
			}),
		});
		if (!network.connected) {
			if (data.cmd == "ERR_NICKNAMEINUSE") {
				var random = config.defaults.nick + Math.floor(10 + (Math.random() * 89));
				client.nick(random);
			}
		}
	});
};
