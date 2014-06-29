var _ = require("lodash");

module.exports = Client;

var id = 0;

function Client(attr) {
	_.merge(this, _.extend({
		id: id++,
		networks: [],
		sockets: null
	}, attr));
}

Client.prototype.emit = function(event, data) {
	if (this.sockets != null) {
		this.sockets.in(this.id).emit(event, data);
	}
};