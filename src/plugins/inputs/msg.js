"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");

exports.commands = ["query", "msg", "say"];

function getTarget(cmd, args, chan) {
	switch (cmd) {
		case "msg":
		case "query":
			return args.shift();
		default:
			return chan.name;
	}
}

exports.input = function(network, chan, cmd, args) {
	let targetName = getTarget(cmd, args, chan);

	if (cmd === "query") {
		if (!targetName) {
			chan.pushMessage(
				this,
				new Msg({
					type: Msg.Type.ERROR,
					text: "You cannot open a query window without an argument.",
				})
			);
			return;
		}

		const target = network.getChannel(targetName);

		if (typeof target === "undefined") {
			const char = targetName[0];

			if (
				network.irc.network.options.CHANTYPES &&
				network.irc.network.options.CHANTYPES.includes(char)
			) {
				chan.pushMessage(
					this,
					new Msg({
						type: Msg.Type.ERROR,
						text: "You can not open query windows for channels, use /join instead.",
					})
				);
				return;
			}

			for (let i = 0; i < network.irc.network.options.PREFIX.length; i++) {
				if (network.irc.network.options.PREFIX[i].symbol === char) {
					chan.pushMessage(
						this,
						new Msg({
							type: Msg.Type.ERROR,
							text:
								"You can not open query windows for names starting with a user prefix.",
						})
					);
					return;
				}
			}

			const newChan = this.createChannel({
				type: Chan.Type.QUERY,
				name: targetName,
			});

			this.emit("join", {
				network: network.uuid,
				chan: newChan.getFilteredClone(true),
				shouldOpen: true,
				index: network.addChannel(newChan),
			});
			this.save();
			newChan.loadMessages(this, network);
		}
	}

	if (args.length === 0 || !targetName) {
		return true;
	}

	const msg = args.join(" ");

	if (msg.length === 0) {
		return true;
	}

	network.irc.say(targetName, msg);

	if (!network.irc.network.cap.isEnabled("echo-message")) {
		const parsedTarget = network.irc.network.extractTargetGroup(targetName);
		let targetGroup;

		if (parsedTarget) {
			targetName = parsedTarget.target;
			targetGroup = parsedTarget.target_group;
		}

		const channel = network.getChannel(targetName);

		if (typeof channel !== "undefined") {
			network.irc.emit("privmsg", {
				nick: network.irc.user.nick,
				ident: network.irc.user.username,
				hostname: network.irc.user.host,
				target: targetName,
				group: targetGroup,
				message: msg,
			});
		}
	}

	return true;
};
