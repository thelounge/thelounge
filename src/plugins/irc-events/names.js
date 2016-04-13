var _ = require("lodash");
var User = require("../../models/user");

module.exports = function(irc, network) {
	var client = this;
	irc.on("userlist", function(data) {
		var chan = network.getChannel(data.channel);
		if (typeof chan === "undefined") {
			return;
		}
		chan.users = [];
		_.each(data.users, function(u) {
			var user = new User(u);

			// irc-framework sets characater mode, but lounge works with symbols
			if (user.mode) {
				user.mode = network.prefixLookup[user.mode];
			}

			chan.users.push(user);
		});
		chan.sortUsers(irc);
		client.emit("users", {
			chan: chan.id
		});
	});
};
