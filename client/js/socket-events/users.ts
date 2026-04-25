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

function handleMonitorStatus(
	{changedChannels, networkId}: {changedChannels: string[]; networkId: string},
	online: boolean
) {
	const network = store.getters.findNetwork(networkId);

	if (network) {
		for (const channel of network.channels) {
			if (changedChannels.includes(channel.name)) {
				channel.isOnline = online;
			}
		}
	}
}

socket.on("users:online", (data) => handleMonitorStatus(data, true));
socket.on("users:offline", (data) => handleMonitorStatus(data, false));
