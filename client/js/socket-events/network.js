"use strict";

const $ = require("jquery");
const socket = require("../socket");
const {vueApp, initChannel, findChannel} = require("../vue");

socket.on("network", function(data) {
	const network = data.networks[0];

	network.isJoinChannelShown = false;
	network.isCollapsed = false;
	network.channels.forEach(initChannel);

	vueApp.networks.push(network);
	vueApp.$router.push("chan-" + network.channels[0].id);

	$("#connect")
		.find(".btn")
		.prop("disabled", false);
});

socket.on("network:options", function(data) {
	vueApp.networks.find((n) => n.uuid === data.network).serverOptions = data.serverOptions;
});

socket.on("network:status", function(data) {
	const network = vueApp.networks.find((n) => n.uuid === data.network);

	if (!network) {
		return;
	}

	network.status.connected = data.connected;
	network.status.secure = data.secure;

	if (!data.connected) {
		network.channels.forEach((channel) => {
			channel.users = [];
			channel.state = 0;
		});
	}
});

socket.on("channel:state", function(data) {
	const channel = findChannel(data.chan);

	if (channel) {
		channel.channel.state = data.state;
	}
});

socket.on("network:info", function(data) {
	vueApp.$store.commit("currentNetworkConfig", data.defaults);
	vueApp.$store.commit("activeWindow", "NetworkEdit");
	vueApp.activeChannel = null;
});
