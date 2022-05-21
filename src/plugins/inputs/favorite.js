"use strict";

const Msg = require("../../models/msg");
const User = require("../../models/user");

exports.commands = ["favorite"];
exports.allowDisconnected = true;

exports.input = function (network, chan, cmd, args) {
	const client = this;

	if (args.length === 0) {
		chan.pushMessage(
			client,
			new Msg({
				type: Msg.Type.ERROR,
				text: `Usage: /favorite [channel-or-conversation-name]`,
			})
		);

		return;
	} else if (args.length === 1) {
		const channel = network.channels.find((c) => c.name === args[0]);

		if (!channel) {
			chan.pushMessage(
				client,
				new Msg({
					type: Msg.Type.ERROR,
					text: `Channel or conversation ${args[0]} not found.`,
				})
			);
			return;
		}

		this.addToFavorites(network.uuid, channel.id);

		chan.pushMessage(
			client,
			new Msg({
				// type: Msg.Type.ACTION,
				text: `Favorited ${channel.name}`,
				from: new User({
					nick: network.irc.user.nick,
				}),
				self: true,
			})
		);
	}

	this.save();
};
