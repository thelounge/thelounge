var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(slate, network) {
	var client = this;
	slate.on("nick", function(data) {
		if (data["new"] == slate.me) {
			var chan = network.channels[0];
			var msg = new Msg({
				from: "-!-",
				text: "You're now known as " + data["new"],
			});
			chan.addMsg(msg);
			client.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
		network.channels.forEach(function(chan) {
			var user = _.findWhere(chan.users, {name: data.nick});
			if (!user) {
				return;
			}
			user.name = data["new"];
			chan.sortUsers();
			client.emit("users", {
				id: chan.id,
				users: chan.users,
			});
			var msg = new Msg({
				type: "nick",
				from: data.nick,
				text: data["new"],
			});
			chan.addMsg(msg);
			client.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		});
	});
};
