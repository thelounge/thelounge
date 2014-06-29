var _ = require("lodash");

module.exports = Network;

var id = 0;

function Network(attr) {
	_.merge(this, _.extend({
		id: id++,
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
