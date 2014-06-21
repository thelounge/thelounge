var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");
var User = require("../models/user");

module.exports = function(client, sockets) {
	var network = this;
	client.on("join", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			chan = new Chan({
				name: data.channel,
			});
			network.addChan(chan);
			sockets.in("chat").emit("join", {
				id: network.id,
				chan: chan,
			});
		}
		var users = chan.users;
		users.push(new User({name: data.nick}));
		chan.sortUsers();
		sockets.in("chat").emit("users", {
			id: chan.id,
			users: users,
		});
		var msg = new Msg({
			from: data.nick,
			type: "join",
		});
		chan.addMsg(msg);
		sockets.in("chat").emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
