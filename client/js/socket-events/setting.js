"use strict";

import socket from "../socket";
import store from "../store";

socket.on("setting:new", function (data) {
	const name = data.name;
	const value = data.value;
	store.dispatch("settings/update", {name, value, sync: false});
});

socket.on("setting:all", function (settings) {
	const serverHasSettings = Object.keys(settings).length > 0;

	store.commit("serverHasSettings", serverHasSettings);

	if (serverHasSettings) {
		for (const name in settings) {
			store.dispatch("settings/update", {name, value: settings[name], sync: false});
		}
	} else {
		store.dispatch("settings/syncAll");
	}
});
