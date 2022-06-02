import socket from "../socket";
import {store} from "../store";
import {switchToChannel} from "../router";

socket.on("msg:special", function (data) {
	const netChan = store.getters.findChannel(data.chan);
	// @ts-ignore
	netChan.channel.data = data.data;
	// @ts-ignore
	switchToChannel(netChan.channel);
});
