var _ = require("lodash");

module.exports = Network;

function Network(attr) {
	_.merge(this, _.extend({
		id: global.id = ++global.id || 1,
		connected: false,
		slate: null,
		host: "",
		name: capitalize(this.host.split(".")[1]) || this.host,
		channels: []
	}, attr));
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
