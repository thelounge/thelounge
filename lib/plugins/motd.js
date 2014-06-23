var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(slate, network) {
	var client = this;
	slate.on("motd", function(data) {
		var rows = data.motd;
		var chan = network.channels[0];
		var msg = new Msg({
			type: "motd-toggle",
			from: "-!-"
		});
		chan.addMsg(msg);
		client.emit("msg", {
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
			client.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		});
	});
};
