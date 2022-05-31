import socket from "../socket";
import {store} from "../store";

socket.on("setting:new", async function (data) {
	const name = data.name;
	const value = data.value;
	await store.dispatch("settings/update", {name, value, sync: false});
});

socket.on("setting:all", async function (settings) {
	const serverHasSettings = Object.keys(settings).length > 0;

	store.commit("serverHasSettings", serverHasSettings);

	if (serverHasSettings) {
		for (const name in settings) {
			await store.dispatch("settings/update", {name, value: settings[name], sync: false});
		}
	} else {
		await store.dispatch("settings/syncAll");
	}
});
