var _ = require("lodash");
var Chan = require("./chan");

module.exports = Network;

var id = 0;

function Network(attr) {
	_.merge(this, _.extend({
		name: "",
		host: "",
		port: 6667,
		tls: false,
		password: "",
		commands: [],
		username: "",
		realname: "",
		channels: [],
		connected: false,
		id: id++,
		irc: null,
	}, attr));
	this.name = attr.name || prettify(attr.host);
	this.channels.unshift(
		new Chan({
			name: this.name,
			type: Chan.Type.LOBBY
		})
	);
}

Network.prototype.toJSON = function() {
	var json = _.extend(this, {nick: (this.irc || {}).me || ""});
	return _.omit(json, "irc", "password");
};

Network.prototype.export = function() {
	var network = _.pick(this, [
		"name",
		"host",
		"port",
		"tls",
		"password",
		"username",
		"realname",
		"commands"
	]);
	network.nick = (this.irc || {}).me;
	network.join = _.map(
		_.filter(this.channels, {type: "channel"}),
		"name"
	).join(",");
	return network;
};

function prettify(host) {
	var name = capitalize(host.split(".")[1]);
	if (!name) {
		name = host;
	}
	return name;
}

function capitalize(str) {
	if (typeof str === "string") {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}
