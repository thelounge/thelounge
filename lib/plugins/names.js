var _ = require("lodash");
var Chan = require("../models/chan");
var User = require("../models/user");

module.exports = function(client, sockets) {
	var network = this;
	client.on("names", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			return;
		}
		chan.users = [];
		_.each(data.names, function(n) {
			chan.addUser(new User(n));
		});
		chan.sortUsers();
		sockets.in("chat").emit("users", {
			id: chan.id,
			users: chan.users,
		});
	});
};
