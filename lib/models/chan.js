var _ = require("lodash");

module.exports = Chan;

Chan.Type = {
	CHANNEL: "channel",
	LOBBY: "lobby",
	QUERY: "query"
};

var id = 0;

function Chan(attr) {
	_.merge(this, _.extend({
		id: id++,
		type: Chan.Type.CHANNEL,
		name: "",
		messages: [],
		users: []
	}, attr));
}

Chan.prototype.sortUsers = function() {
	this.users = _.sortBy(
		this.users,
		function(u) { return u.name.toLowerCase(); }
	);
	var modes = [
		"~",
		"%",
		"@",
		"+",
	].reverse();
	modes.forEach(function(mode) {
		this.users = _.remove(
			this.users,
			function(u) { return u.mode == mode; }
		).concat(this.users);
	}, this);
};
