var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(slate, network) {
	var client = this;
	slate.on("kick", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			return;
		}
		if (data.client == slate.me) {
			chan.users = [];
		} else {
			chan.users = _.without(chan.users, _.findWhere(chan.users, {name: data.client}));
		}
		client.emit("users", {
			id: chan.id,
			users: chan.users,
		});
		var msg = new Msg({
			type: "kick",
			from: data.nick,
			text: data.client,
		});
		chan.addMsg(msg);
		client.emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
