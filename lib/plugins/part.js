var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");

module.exports = function(slate, network) {
	var client = this;
	slate.on("part", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channels[0]});
		if (typeof chan === "undefined") {
			return;
		}
		if (data.nick == slate.me) {
			network.channels = _.without(network.channels, chan);
			client.emit("part", {
				id: chan.id,
			});
		} else {
			chan.users = _.without(chan.users, _.findWhere(chan.users, {name: data.nick}));
			client.emit("users", {
				id: chan.id,
				users: chan.users,
			});
			var msg = new Msg({
				type: "part",
				from: data.nick,
			});
			chan.addMsg(msg);
			client.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
	});
};
