var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(slate, network) {
	var client = this;
	slate.on("topic", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			return;
		}
		var from = data.nick || chan.name;
		var msg = new Msg({
			type: "topic",
			from: from,
			text: data.topic,
		});
		chan.addMsg(msg);
		client.emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
