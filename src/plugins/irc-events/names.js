"use strict";

var User = require("../../models/user");

module.exports = function(irc, network) {
	var client = this;
	irc.on("userlist", function(data) {
		var chan = network.getChannel(data.channel);
		if (typeof chan === "undefined") {
			return;
		}

		chan.users = data.users.map(user => {
			return new User({
				nick: user.nick,
				modes: user.modes,
			}, network.prefixLookup);
		});

		chan.sortUsers(irc);

		client.emit("users", {
			chan: chan.id
		});
	});
};
