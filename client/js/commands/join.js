"use strict";

exports.input = function(args) {
	const utils = require("../utils");
	const socket = require("../socket");
	const {vueApp} = require("../vue");

	if (args.length > 0) {
		let channels = args[0];

		if (channels.length > 0) {
			const chanTypes = vueApp.activeChannel.network.serverOptions.CHANTYPES;
			const channelList = args[0].split(",");

			if (chanTypes && chanTypes.length > 0) {
				for (let c = 0; c < channelList.length; c++) {
					if (!chanTypes.includes(channelList[c][0])) {
						channelList[c] = chanTypes[0] + channelList[c];
					}
				}
			}

			channels = channelList.join(",");

			const chan = utils.findCurrentNetworkChan(channels);

			if (chan) {
				vueApp.$router.push("chan-" + chan.id);
			} else {
				socket.emit("input", {
					text: `/join ${channels} ${args.length > 1 ? args[1] : ""}`,
					target: vueApp.activeChannel.channel.id,
				});

				return true;
			}
		}
	} else if (vueApp.activeChannel.channel.type === "channel") {
		// If `/join` command is used without any arguments, re-join current channel
		socket.emit("input", {
			target: vueApp.activeChannel.channel.id,
			text: `/join ${vueApp.activeChannel.channel.name}`,
		});

		return true;
	}
};
