"use strict";

const socket = require("../socket");
const {vueApp} = require("../vue");

socket.on("changelog", function(data) {
	vueApp.$store.commit("versionData", data);
	vueApp.$store.commit("versionDataExpired", false);

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

	vueApp.$store.commit("versionStatus", status);

	// When there is a button to refresh the checker available, display it when
	// data is expired. Before that, server would return same information anyway.
	if (data.expiresAt) {
		setTimeout(
			() => vueApp.$store.commit("versionDataExpired", true),
			data.expiresAt - Date.now()
		);
	}
});
