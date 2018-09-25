"use strict";

const $ = require("jquery");

exports.input = function(args) {
	const utils = require("../utils");
	const socket = require("../socket");
	const {vueApp} = require("../vue");

	if (args.length > 0) {
		const channel = args[0];

		if (channel.length > 0) {
			const chan = utils.findCurrentNetworkChan(channel);

			if (chan) {
				$(`#sidebar .chan[data-id="${chan.id}"]`).trigger("click");
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
