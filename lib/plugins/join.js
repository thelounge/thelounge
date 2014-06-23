var _ = require("lodash");
var Chan = require("../models/chan");
var Msg = require("../models/msg");
var User = require("../models/user");

module.exports = function(slate, network) {
	var client = this;
	slate.on("join", function(data) {
		var chan = _.find(network.channels, {name: data.channel});
		if (!chan) {
			chan = new Chan({
				name: data.channel
			});
			network.addChan(chan);
			client.emit("join", {
				id: network.id,
				chan: chan,
			});
		}
		var users = chan.users;
		users.push(new User({name: data.nick}));
		chan.sortUsers();
		client.emit("users", {
			id: chan.id,
			users: users,
		});
		var msg = new Msg({
			from: data.nick,
			type: "join",
		});
		chan.addMsg(msg);
		client.emit("msg", {
			id: chan.id,
			msg: msg,
		});
	});
};
