"use strict";

const socket = require("../socket");
const store = require("../store").default;

socket.on("changelog", function(data) {
	store.commit("versionData", data);
	store.commit("versionDataExpired", false);

	let status;

	if (data.latest) {
		status = "new-version";
	} else if (data.packages) {
		status = "new-packages";
	} else if (data.current.changelog) {
		status = "up-to-date";
	} else {
		status = "error";
	}

	store.commit("versionStatus", status);

	// When there is a button to refresh the checker available, display it when
	// data is expired. Before that, server would return same information anyway.
	if (data.expiresAt) {
		setTimeout(() => store.commit("versionDataExpired", true), data.expiresAt - Date.now());
	}
});
