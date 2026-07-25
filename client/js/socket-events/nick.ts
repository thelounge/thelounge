import socket from "../socket";
import {store} from "../store";

socket.on("nick", function (data) {
	const network = store.getters.findNetwork(data.network);

	if (network) {
		network.nick = data.nick;
	}
});

socket.on("channel:rename", function (data) {
	const channel = store.getters.findChannel(data.chan);

	if (channel) {
		channel.channel.name = data.name;
	}
});
