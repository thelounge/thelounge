import socket from "../socket";
import {store} from "../store";

socket.on("mute:changed", (response) => {
	const {target, status} = response;

	const netChan = store.getters.findChannel(target);

	if (netChan?.channel.type === "lobby") {
		for (const chan of netChan.network.channels) {
			if (chan.type !== "special") {
				chan.muted = status;
			}
		}
	} else if (netChan) {
		netChan.channel.muted = status;
	}
});
