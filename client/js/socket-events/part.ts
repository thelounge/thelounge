import socket from "../socket";
import {store} from "../store";
import {switchToChannel} from "../router";

socket.on("part", async function (data) {
	// When parting from the active channel/query, jump to the network's lobby
	if (store.state.activeChannel && store.state.activeChannel.channel.id === data.chan) {
		switchToChannel(store.state.activeChannel.network.channels[0]);
	}

	const channel = store.getters.findChannel(data.chan);

	if (!channel) {
		return;
	}

	channel.network.channels.splice(
		channel.network.channels.findIndex((c) => c.id === data.chan),
		1
	);

	await store.dispatch("partChannel", channel);
});
