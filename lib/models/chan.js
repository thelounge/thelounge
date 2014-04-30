var _ = require("lodash");

module.exports = Chan;

function Chan(attr) {
	_.merge(this, _.extend({
		id: global.id = ++global.id || 1,
		name: "",
		type: "",
		messages: [],
		users: [],
	}, attr));
};

Chan.prototype.sortUsers = function() {
	this.users = _.sortBy(
		this.users,
		function(u) { return u.name.toLowerCase(); }
	);
	var modes = ["+", "@"];
	modes.forEach(function(mode) {
		this.users = _.remove(
			this.users,
			function(u) { return u.mode == mode; }
		).concat(this.users);
	}, this);
};
