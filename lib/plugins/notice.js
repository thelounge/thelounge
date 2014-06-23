var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(slate, network) {
	var client = this;
	slate.on("notice", function(data) {
		var chan = network.channels[0];
		var from = data.from || "-!-";
		if (data.to == "*" || data.from.indexOf(".") !== -1) {
			from = "-!-";
		}
		var msg = new Msg({
			type: "notice",
			from: from,
			text: data.message,
		});
		chan.addMsg(msg);
		client.emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
