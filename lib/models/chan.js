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
