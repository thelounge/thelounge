import socket from "../socket";
import {store} from "../store";

socket.on("sync_sort", function (data) {
	const order = data.order;

	switch (data.type) {
		case "networks":
			store.commit(
				"sortNetworks",
				(a, b) => (order as string[]).indexOf(a.uuid) - (order as string[]).indexOf(b.uuid)
			);

			break;

		case "channels": {
			const network = store.getters.findNetwork(data.target);

			if (!network) {
				return;
			}

			network.channels.sort(
				(a, b) => (order as number[]).indexOf(a.id) - (order as number[]).indexOf(b.id)
			);

			break;
		}
	}
});
