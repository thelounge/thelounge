"use strict";

const socket = require("../socket");
const store = require("../store").default;

socket.on("setting:new", function(data) {
	const name = data.name;
	const value = data.value;
	store.dispatch("settings/update", {name, value, sync: false});
});

socket.on("setting:all", function(settings) {
	if (Object.keys(settings).length === 0) {
		store.dispatch("settings/syncAll");
	} else {
		for (const name in settings) {
			store.dispatch("settings/update", {name, value: settings[name], sync: false});
		}
	}
});
