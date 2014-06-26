module.exports = Client;

function Client(attr) {
	_.merge(this, _.extend({
		name: "",
		sockets: null,
		networks: []
	}, attr));
}
