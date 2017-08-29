"use strict";

const _ = require("lodash");
const Chan = require("../../models/chan");
const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	// The following saves the channel key based on channel mode instead of
	// extracting it from `/join #channel key`. This lets us not have to
	// temporarily store the key until successful join, but also saves the key
	// if a key is set or changed while being on the channel.
	irc.on("channel info", function(data) {
		if (!data.modes) {
			return;
		}

		const targetChan = network.getChannel(data.channel);
		if (typeof targetChan === "undefined") {
			return;
		}

		data.modes.forEach((mode) => {
			const text = mode.mode;
			const add = text[0] === "+";
			const char = text[1];

			if (char === "k") {
				targetChan.key = add ? mode.param : "";
				client.save();
			}
		});
	});

	irc.on("mode", function(data) {
		let targetChan;

		if (data.target === irc.user.nick) {
			targetChan = network.channels[0];
		} else {
			targetChan = network.getChannel(data.target);
			if (typeof targetChan === "undefined") {
				return;
			}
		}

		let usersUpdated;
		const userModeSortPriority = {};
		const supportsMultiPrefix = network.irc.network.cap.isEnabled("multi-prefix");

		irc.network.options.PREFIX.forEach((prefix, index) => {
			userModeSortPriority[prefix.symbol] = index;
		});

		data.modes.forEach((mode) => {
			let text = mode.mode;
			const add = text[0] === "+";
			const char = text[1];

			if (char === "k") {
				targetChan.key = add ? mode.param : "";
				client.save();
			}

			if (mode.param) {
				text += " " + mode.param;
			}

			const msg = new Msg({
				time: data.time,
				type: Msg.Type.MODE,
				mode: (targetChan.type !== Chan.Type.LOBBY && targetChan.getMode(data.nick)) || "",
				from: data.nick,
				text: text,
				self: data.nick === irc.user.nick
			});
			targetChan.pushMessage(client, msg);

			if (!mode.param) {
				return;
			}

			const user = targetChan.findUser(mode.param);
			if (!user) {
				return;
			}

			usersUpdated = true;

			if (!supportsMultiPrefix) {
				return;
			}

			const changedMode = network.prefixLookup[char];

			if (!add) {
				_.pull(user.modes, changedMode);
			} else if (user.modes.indexOf(changedMode) === -1) {
				user.modes.push(changedMode);
				user.modes.sort(function(a, b) {
					return userModeSortPriority[a] - userModeSortPriority[b];
				});
			}

			// TODO: remove in future
			user.mode = (user.modes && user.modes[0]) || "";
		});

		if (!usersUpdated) {
			return;
		}

		if (!supportsMultiPrefix) {
			// TODO: This is horrible
			irc.raw("NAMES", data.target);
		} else {
			targetChan.sortUsers(irc);

			client.emit("users", {
				chan: targetChan.id
			});
		}
	});
};
