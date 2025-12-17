import socket from "../socket";
import {store} from "../store";
import {switchToChannel} from "../router";

socket.on("part", async function (data) {
	console.log("[DEBUG] Part event received:", data);
	// When parting from the active channel/query, jump to the network's lobby
	if (store.state.activeChannel && store.state.activeChannel.channel.id === data.chan) {
		switchToChannel(store.state.activeChannel.network.channels[0]);
	}

	const channel = store.getters.findChannel(data.chan);
	console.log("[DEBUG] Found channel:", channel);

	if (!channel) {
		console.log("[DEBUG] Channel not found, returning early");
		return;
	}

	const index = channel.network.channels.findIndex((c) => c.id === data.chan);
	console.log("[DEBUG] Splicing channel at index:", index);
	channel.network.channels.splice(index, 1);
	console.log("[DEBUG] Channel removed, remaining channels:", channel.network.channels.length);

	await store.dispatch("partChannel", channel);
});
