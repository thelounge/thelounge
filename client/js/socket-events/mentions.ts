import socket from "../socket";
import {store} from "../store";
import {ClientMention} from "../types";

socket.on("mentions:list", function (data) {
	store.commit("mentions", data as ClientMention[]);
});
