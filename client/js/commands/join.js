"use strict";

const $ = require("jquery");

exports.input = function(args) {
	const channel = args[0];
	const utils = require("../utils");
	const socket = require("../socket");
	const {vueApp} = require("../vue");

	if (channel) {
		const chan = utils.findCurrentNetworkChan(channel);

		if (chan) {
			$(`#sidebar .chan[data-id="${chan.id}"]`).trigger("click");
		}
	} else if (vueApp.activeChannel.channel.type === "channel") {
		socket.emit("input", {
			target: vueApp.activeChannel.channel.id,
			text: `/join ${vueApp.activeChannel.channel.name}`,
		});

		return true;
	}
};
