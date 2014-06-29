var _ = require("lodash");
var Chan = require("./chan");

module.exports = Network;

var id = 0;

function Network(attr) {
	_.merge(this, _.extend({
		id: id++,
		connected: false,
		host: "",
		irc: null,
		name: capitalize(attr.host.split(".")[1]) || attr.host,
		channels: []
	}, attr));
	this.channels.unshift(
		new Chan({name: this.name, type: Chan.Type.LOBBY})
	);
}

Network.prototype.toJSON = function() {
	return _.omit(this, "irc");
};

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
