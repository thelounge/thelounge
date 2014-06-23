var _ = require("lodash");
var Chan = require("../models/chan");
var User = require("../models/user");

module.exports = function(slate, network) {
	var client = this;
	slate.on("names", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			return;
		}
		chan.users = [];
		_.each(data.names, function(n) {
			chan.addUser(new User(n));
		});
		chan.sortUsers();
		client.emit("users", {
			id: chan.id,
			users: chan.users,
		});
	});
};
