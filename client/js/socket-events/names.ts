import socket from "../socket";
import {store} from "../store";

socket.on("names", function (data) {
	const netChan = store.getters.findChannel(data.id);

	if (netChan) {
		netChan.channel.users = data.users;
	}
});
