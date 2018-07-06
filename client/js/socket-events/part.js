"use strict";

const $ = require("jquery");
const socket = require("../socket");
const {vueApp} = require("../vue");

socket.on("part", function(data) {
	// When parting from the active channel/query, jump to the network's lobby
	if (vueApp.activeChannel && vueApp.activeChannel.channel.id === data.chan) {
		$("#sidebar .chan[data-id='" + data.chan + "']")
			.closest(".network")
			.find(".lobby")
			.trigger("click");
	}

	$("#chan-" + data.chan).remove();

	const network = vueApp.networks.find((n) => n.uuid === data.network);
	network.channels.splice(network.channels.findIndex((c) => c.id === data.chan), 1);
});
