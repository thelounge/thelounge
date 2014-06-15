var _ = require("lodash");
var Chan = require("./chan");

module.exports = Network;

function Network(attr) {
	_.merge(this, _.extend({
		id: global.id = ++global.id || 1,
		client: null,
		connected: false,
		host: "",
		nick: "",
		channels: [],
	}, attr));
	
	// Add lobby
	this.channels.unshift(
		new Chan({name: this.host, type: "lobby"})
	);
};

Network.prototype.addChan = function(chan) {
		this.channels.push(chan);
};

Network.prototype.toJSON = function() {
	var clone = _.omit(this, [
		"client",
		"connected",
	]);
	clone.name = clone.host.split(".")[1] || clone.host;
	return clone;
};
