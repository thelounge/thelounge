var _ = require("lodash");

module.exports = Client;

function Client(attr) {
	_.merge(this, _.extend({
		name: "",
		networks: [],
		sockets: null,
	}, attr));
};

Client.prototype.emit = function(event, data) {
	if (this.sockets != null) {
		this.sockets.in(this.name).emit(event, data);
	}
};
