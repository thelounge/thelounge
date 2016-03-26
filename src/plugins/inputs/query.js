var _ = require("lodash");
var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

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

	var char = target[0];
	if (network.irc.network.options.CHANTYPES && network.irc.network.options.CHANTYPES.indexOf(char) !== -1) {
		this.emit("msg", {
			chan: chan.id,
			msg: new Msg({
				type: Msg.Type.ERROR,
				text: "You can not open query windows for channels, use /join instead."
			})
		});
		return;
	}

	for (var i = 0; i < network.irc.network.options.PREFIX.length; i++) {
		if (network.irc.network.options.PREFIX[i].symbol === char) {
			this.emit("msg", {
				chan: chan.id,
				msg: new Msg({
					type: Msg.Type.ERROR,
					text: "You can not open query windows for names starting with a user prefix."
				})
			});
			return;
		}
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
