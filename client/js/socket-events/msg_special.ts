import socket from "../socket";
import {store} from "../store";
import {switchToChannel} from "../router";

socket.on("msg:special", function (data) {
	const netChan = store.getters.findChannel(data.chan);

	if (!netChan) {
		return;
	}

	netChan.channel.data = data.data;
	switchToChannel(netChan.channel);
});
