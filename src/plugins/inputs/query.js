var _ = require("lodash");
var Chan = require("../../models/chan");

exports.commands = ["query"];

exports.input = function(network, chan, cmd, args) {
	if (args.length === 0) {
		return;
	}

	var target = args[0];
	var query = _.find(network.channels, {name: target});
	if (typeof query !== "undefined") {
		return;
	}

	// If target doesn't start with an allowed character, ignore
	if (!/^[a-zA-Z_\\\[\]{}^`|]/.test(target)) {
		return;
	}

	var newChan = new Chan({
		type: Chan.Type.QUERY,
		name: target
	});
	network.channels.push(newChan);
	this.emit("join", {
		network: network.id,
		chan: newChan
	});
};
