import socket from "../socket";
import {store} from "../store";

socket.on("sync_sort:networks", function (data) {
	store.commit("sortNetworks", (a, b) => data.order.indexOf(a.uuid) - data.order.indexOf(b.uuid));
});

socket.on("sync_sort:channels", function (data) {
	const network = store.getters.findNetwork(data.network);

	if (!network) {
		return;
	}

	network.channels.sort((a, b) => data.order.indexOf(a.id) - data.order.indexOf(b.id));
});
