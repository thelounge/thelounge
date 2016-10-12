"use strict";

var _ = require("lodash");
var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("mode", function(data) {
		var targetChan;

		if (data.target === irc.user.nick) {
			targetChan = network.channels[0];
		} else {
			targetChan = network.getChannel(data.target);
			if (typeof targetChan === "undefined") {
				return;
			}
		}

		var usersUpdated;
		var supportsMultiPrefix = network.irc.network.cap.isEnabled("multi-prefix");
		var userModeSortPriority = {};

		irc.network.options.PREFIX.forEach((prefix, index) => {
			userModeSortPriority[prefix.symbol] = index;
		});

		for (var i = 0; i < data.modes.length; i++) {
			var mode = data.modes[i];
			var text = mode.mode;

			if (mode.param) {
				text += " " + mode.param;
			}

			var msg = new Msg({
				time: data.time,
				type: Msg.Type.MODE,
				mode: (targetChan.type !== Chan.Type.LOBBY && targetChan.getMode(data.nick)) || "",
				from: data.nick,
				text: text,
				self: data.nick === irc.user.nick
			});
			targetChan.pushMessage(client, msg);

			if (!mode.param) {
				continue;
			}

			var user = _.find(targetChan.users, {name: mode.param});
			if (!user) {
				continue;
			}

			usersUpdated = true;

			if (!supportsMultiPrefix) {
				continue;
			}

			var add = mode.mode[0] === "+";
			var changedMode = network.prefixLookup[mode.mode[1]];

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
		}

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
