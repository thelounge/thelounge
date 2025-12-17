import socket from "../socket";
import {store} from "../store";

socket.on("pin:changed", (response) => {
	const {target, status} = response;

	const netChan = store.getters.findChannel(target);

	if (netChan) {
		netChan.channel.pinned = status;
	}
});
