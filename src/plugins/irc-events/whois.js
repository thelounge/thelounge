var _ = require("lodash");
var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("whois", function(err, data) {
		if (data === null) {
			return;
		}
		var chan = _.findWhere(network.channels, {name: data.nickname});
		if (typeof chan === "undefined") {
			chan = new Chan({
				type: Chan.Type.QUERY,
				name: data.nickname
			});
			network.channels.push(chan);
			client.emit("join", {
				network: network.id,
				chan: chan
			});
		}
		var prefix = {
			hostname: "from",
			realname: "is",
			channels: "on",
			server: "using"
		};
		for (var k in data) {
			var key = prefix[k];
			if (!key || data[k].toString() === "") {
				continue;
			}
			var msg = new Msg({
				type: Msg.Type.WHOIS,
				from: data.nickname,
				text: key + " " + data[k]
			});
			chan.messages.push(msg);
			client.emit("msg", {
				chan: chan.id,
				msg: msg
			});
		}
	});
};
