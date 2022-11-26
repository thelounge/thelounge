import socket from "../socket";
import {store} from "../store";

socket.on("search:results", (response) => {
	const pendingQuery = store.state.messageSearchPendingQuery;

	if (
		!pendingQuery ||
		pendingQuery.channelName !== response.channelName ||
		pendingQuery.networkUuid !== response.networkUuid ||
		pendingQuery.offset !== response.offset ||
		pendingQuery.searchTerm !== response.searchTerm
	) {
		// This is a response from a search that we are not interested in.
		// The user may have entered a different search while one was still in flight.
		// We can simply drop it on the floor.
		return;
	}

	store.commit("messageSearchPendingQuery", null);

	if (store.state.messageSearchResults) {
		store.commit("addMessageSearchResults", response);
		return;
	}

	store.commit("messageSearchResults", {results: response.results});
});
