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
		messages: [],
		name: "",
		topic: "",
		type: Chan.Type.CHANNEL,
		unread: 0,
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
		"&",
		"@",
		"%",
		"+",
	].reverse();
	modes.forEach(function(mode) {
		this.users = _.remove(
			this.users,
			function(u) { return u.mode === mode; }
		).concat(this.users);
	}, this);
};

Chan.prototype.getMode = function(name) {
	var user = _.find(this.users, {name: name});
	if (user) {
		return user.mode;
	} else {
		return "";
	}
};

Chan.prototype.toJSON = function() {
	var clone = _.clone(this);
	clone.messages = clone.messages.slice(-100);
	return clone;
};
