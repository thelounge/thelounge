"use strict";

const socket = require("../socket");
const {vueApp, initChannel} = require("../vue");
const store = require("../store").default;
const {switchToChannel} = require("../router");

socket.on("network", function(data) {
	const network = data.networks[0];

	network.isJoinChannelShown = false;
	network.isCollapsed = false;
	network.channels.forEach(initChannel);

	store.commit("networks", [...store.state.networks, network]);
	switchToChannel(network.channels[0]);
});

socket.on("network:options", function(data) {
	const network = store.getters.findNetwork(data.network);

	if (network) {
		network.serverOptions = data.serverOptions;
	}
});

socket.on("network:status", function(data) {
	const network = store.getters.findNetwork(data.network);

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
	const channel = store.getters.findChannel(data.chan);

	if (channel) {
		channel.channel.state = data.state;
	}
});

socket.on("network:info", function(data) {
	const network = store.getters.findNetwork(data.uuid);

	if (!network) {
		return;
	}

	for (const key in data) {
		vueApp.$set(network, key, data[key]);
	}
});
