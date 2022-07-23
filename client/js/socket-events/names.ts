import socket from "../socket";
import {User} from "../../../server/models/user";
import {store} from "../store";

socket.on("names", function (data) {
	const netChan = store.getters.findChannel(data.id);

	if (netChan) {
		netChan.channel.users = data.users?.map((u) => new User(u));
	}
});
