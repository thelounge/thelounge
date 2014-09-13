var _ = require("lodash");

module.exports = User;

function User(attr) {
	_.merge(this, _.extend({
		mode: "",
		name: ""
	}, attr));
}
