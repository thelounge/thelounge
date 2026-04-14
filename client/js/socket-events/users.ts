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

socket.on("user:away", ({chan, nick, away}) => {
	const channel = store.getters.findChannel(chan);

	if (channel) {
		channel.channel.userAway = away || undefined;

		const user = channel.channel.users.find((u) => u.nick.toLowerCase() === nick.toLowerCase());

		if (user) {
			user.away = away || "";
		}
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

socket.on("users:offline", ({changedChannels, networkId}) => {
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
