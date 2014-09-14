var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("mode", function(data) {
		var chan = _.findWhere(network.channels, {name: data.target});
		if (typeof chan !== "undefined") {
			setTimeout(function() {
				irc.write("NAMES " + data.target);
			}, 200);
			var nick = data.nick;
			if (nick.indexOf(".") !== -1) {
				nick = data.target;
			}
			var from_me = false
			if (nick.toLowerCase() == irc.me.toLowerCase() ) {
				from_me = true
			}
			var msg = new Msg({
				type: Msg.Type.MODE,
				from: nick,
				text: data.mode + " " + data.client,
				from_me: from_me
			});
			chan.messages.push(msg);
			client.emit("msg", {
				chan: chan.id,
				msg: msg,
			});
		}
	});
};
