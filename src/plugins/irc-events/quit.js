var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("quit", function(data) {
		network.channels.forEach(function(chan) {
			var from = data.nick;
			var user = _.findWhere(chan.users, {name: from});
			if (typeof user === "undefined") {
				return;
			}
			chan.users = _.without(chan.users, user);
			client.emit("users", {
				chan: chan.id,
				users: chan.users
			});
			var msg = new Msg({
				type: Msg.Type.QUIT,
				mode: chan.getMode(from),
				from: from
			});
			chan.messages.push(msg);
			client.emit("msg", {
				chan: chan.id,
				msg: msg
			});
		});
	});
};
