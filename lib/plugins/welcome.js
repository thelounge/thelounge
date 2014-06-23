var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(slate, network) {
	var client = this;
	slate.on("welcome", function(data) {
		network.connected = true;
		slate.write("PING " + network.host);
		var chan = network.channels[0];
		var msg = new Msg({
			from: "-!-",
			text: "You're now known as " + data,
		});
		chan.addMsg(msg);
		client.emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
