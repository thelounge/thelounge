var Msg = require("../models/msg");

module.exports = function(slate, network) {
	var client = this;
	slate.on("errors", function(data) {
		client.emit("msg", {
			msg: new Msg({
				type: "error",
				from: "-!-",
				text: data.message,
			}),
		});
		if (!network.connected) {
			if (data.cmd == "ERR_NICKNAMEINUSE") {
				var random = client.nick + Math.floor(10 + (Math.random() * 89));
				slate.nick(random);
			}
		}
	});
};
