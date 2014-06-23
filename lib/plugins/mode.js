var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(slate, network) {
	var client = this;
	var timer = null;
	slate.on("mode", function(data) {
		var chan = _.findWhere(network.channels, {name: data.target});
		if (typeof chan !== "undefined") {
			clearTimeout(timer);
			timer = setTimeout(function() {
				slate.write("NAMES " + data.target);
			}, 200);
			var nick = data.nick;
			if (nick.indexOf(".") !== -1) {
				nick = data.target;
			}
			var msg = new Msg({
				type: "mode",
				from: nick,
				text: data.mode + " " + data.client,
			});
			chan.addMsg(msg);
			client.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
	});
};
