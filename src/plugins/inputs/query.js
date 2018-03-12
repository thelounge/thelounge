"use strict";

const _ = require("lodash");
const Chan = require("../../models/chan");
const Msg = require("../../models/msg");

exports.commands = ["query"];

exports.input = function(network, chan, cmd, args) {
	const target = args[0];

	if (args.length === 0 || target.length === 0) {
		chan.pushMessage(this, new Msg({
			type: Msg.Type.ERROR,
			text: "You cannot open a query window without an argument.",
		}));
		return;
	}

	const query = _.find(network.channels, {name: target});

	if (typeof query !== "undefined") {
		return;
	}

	const char = target[0];

	if (network.irc.network.options.CHANTYPES && network.irc.network.options.CHANTYPES.includes(char)) {
		chan.pushMessage(this, new Msg({
			type: Msg.Type.ERROR,
			text: "You can not open query windows for channels, use /join instead.",
		}));
		return;
	}

	for (let i = 0; i < network.irc.network.options.PREFIX.length; i++) {
		if (network.irc.network.options.PREFIX[i].symbol === char) {
			chan.pushMessage(this, new Msg({
				type: Msg.Type.ERROR,
				text: "You can not open query windows for names starting with a user prefix.",
			}));
			return;
		}
	}

	const newChan = new Chan({
		type: Chan.Type.QUERY,
		name: target,
	});

	this.emit("join", {
		network: network.id,
		chan: newChan.getFilteredClone(true),
		shouldOpen: true,
		index: network.addChannel(newChan),
	});
	this.save();
	newChan.loadMessages(this, network);
};
