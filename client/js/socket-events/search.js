import socket from "../socket";
import store from "../store";

socket.on("search:results", (response) => {
	store.commit("messageSearchInProgress", false);
	store.commit("messageSearchResults", response);
});
