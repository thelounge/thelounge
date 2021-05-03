import socket from "../socket";
import store from "../store";

socket.on("search:results", (response) => {
	store.commit("messageSearchInProgress", false);

	if (store.state.messageSearchResults) {
		store.commit("addMessageSearchResults", response);
		return;
	}

	store.commit("messageSearchResults", response);
});
