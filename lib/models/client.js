var _ = require("lodash");
var Network = require("./network");

module.exports = Client;

var id = 0;

function Client(attr) {
	_.merge(this, _.extend({
		id: id++,
		networks: [],
		nick: "",
		keepAlive: false,
		sockets: null
	}, attr));
}

Client.prototype.emit = function(event, data) {
	if (this.sockets !== null) {
		this.sockets.in(this.id).emit(event, data);
	}
};

Client.prototype.find = function(id) {
	var network = null;
	var chan = null;
	this.networks.forEach(function(n) {
		chan = _.find(n.channels, {id: id});
		if (chan) {
			network = n;
		}
	});
	if (network && chan) {
		return {
			network: network,
			chan: chan
		};
	} else {
		return false;
	}
};
