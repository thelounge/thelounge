var _ = require("lodash");

module.exports = User;

function User(attr) {
	// TODO: Remove this
	attr.name = attr.nick;
	attr.mode = attr.modes[0] || "";

	_.merge(this, _.extend({
		mode: "",
		name: ""
	}, attr));
}
