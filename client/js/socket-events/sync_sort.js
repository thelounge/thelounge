"use strict";

import socket from "../socket";
import store from "../store";

socket.on("sync_sort", function (data) {
	const order = data.order;

	switch (data.type) {
		case "networks":
			store.commit("sortNetworks", (a, b) => order.indexOf(a.uuid) - order.indexOf(b.uuid));

			break;

		case "channels": {
			const network = store.getters.findNetwork(data.target);

			if (!network) {
				return;
			}

			network.channels.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

			break;
		}
	}
});
