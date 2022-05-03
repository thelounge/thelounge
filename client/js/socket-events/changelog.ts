"use strict";

import socket from "../socket";
import store from "../store";

socket.on("changelog", function (data) {
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
		const expires = data.expiresAt - Date.now();

		if (expires > 0) {
			setTimeout(() => store.commit("versionDataExpired", true), expires);
		} else {
			store.commit("versionDataExpired", true);
		}
	}
});

socket.on("changelog:newversion", () => {
	store.state.serverConfiguration.isUpdateAvailable = true;
});
