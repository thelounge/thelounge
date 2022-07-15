import socket from "../socket";
import {store} from "../store";

socket.on("sessions:list", function (data) {
	data.sort((a, b) => b.lastUse - a.lastUse);
	store.commit("sessions", data);
});
