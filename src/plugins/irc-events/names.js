"use strict";

const User = require("../../models/user");

module.exports = function(irc, network) {
	const client = this;

	irc.on("userlist", function(data) {
		const chan = network.getChannel(data.channel);
		if (typeof chan === "undefined") {
			return;
		}

		// Create lookup map of current users,
		// as we need to keep certain properties
		// and we can recycle existing User objects
		const oldUsers = new Map();

		chan.users.forEach((user) => {
			oldUsers.set(user.nick, user);
		});

		chan.users = data.users.map((user) => {
			const oldUser = oldUsers.get(user.nick);

			// For existing users, we only need to update mode
			if (oldUser) {
				oldUser.setModes(user.modes, network.prefixLookup);
				return oldUser;
			}

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
