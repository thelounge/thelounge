import socket from "../socket";
import {store} from "../store";
import {switchToChannel} from "../router";
import {toClientChan} from "../chan";
import {ClientNetwork} from "../types";
import {ChanState} from "../../../shared/types/chan";

socket.on("network", function (data) {
	const network: ClientNetwork = {
		...data.network,
		channels: data.network.channels.map(toClientChan),
		isJoinChannelShown: false,
		isCollapsed: false,
	};

	store.commit("networks", [...store.state.networks, network]);

	// Open last channel specified in `join`
	switchToChannel(network.channels[network.channels.length - 1]);
});

socket.on("network:options", function (data) {
	const network = store.getters.findNetwork(data.network);

	if (network) {
		network.serverOptions = data.serverOptions;
	}
});

socket.on("network:status", function (data) {
	const network = store.getters.findNetwork(data.network);

	if (!network) {
		return;
	}

	network.status.connected = data.connected;
	network.status.secure = data.secure;

	if (!data.connected) {
		network.channels.forEach((channel) => {
			channel.users = []; // TODO: untangle this
			channel.state = ChanState.PARTED;
		});
	}
});

socket.on("channel:state", function (data) {
	const channel = store.getters.findChannel(data.chan);

	if (channel) {
		channel.channel.state = data.state;
	}
});

socket.on("network:info", function (data) {
	const network = store.getters.findNetwork(data.uuid);

	if (!network) {
		return;
	}

	for (const key in data) {
		network[key] = data[key];
	}
});

socket.on("network:name", function (data) {
	const network = store.getters.findNetwork(data.uuid);

	if (network) {
		network.name = network.channels[0].name = data.name;
	}
});
