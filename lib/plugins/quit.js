var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(slate, network) {
	var client = this;
	slate.on("quit", function(data) {
		network.channels.forEach(function(chan) {
			var user = _.findWhere(chan.users, {name: data.nick});
			if (!user) {
				return;
			}
			chan.users = _.without(chan.users, user);
			client.emit("users", {
				id: chan.id,
				users: chan.users,
			});
			var msg = new Msg({
				type: "quit",
				from: data.nick,
			});
			chan.addMsg(msg);
			client.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		});
	});
};
