import socket from "../socket";
import {store} from "../store";

socket.on("users", function (data) {
	if (store.state.activeChannel && store.state.activeChannel.channel.id === data.chan) {
		return socket.emit("names", {
			target: data.chan,
		});
	}

	const channel = store.getters.findChannel(data.chan);

	if (channel) {
		channel.channel.usersOutdated = true;
	}
});

socket.on("users:online", ({changedChannels, networkId}) => {
	for (const network of store.state.networks) {
		if (network.uuid === networkId) {
			for (const channel of network.channels) {
				if (changedChannels.includes(channel.name)) {
					channel.isOnline = true;
				}
			}

			break;
		}
	}
});

socket.on("users:offline", function ({changedChannels, networkId}) {
	for (const network of store.state.networks) {
		if (network.uuid === networkId) {
			for (const channel of network.channels) {
				if (changedChannels.includes(channel.name)) {
					channel.isOnline = false;
				}
			}

			break;
		}
	}
});
