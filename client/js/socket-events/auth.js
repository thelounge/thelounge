"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");
const {getActiveWindowComponent} = require("../vue");
const store = require("../store").default;
let lastServerHash = -1;

socket.on("auth", function(data) {
	// If we reconnected and serverHash differs, that means the server restarted
	// And we will reload the page to grab the latest version
	if (lastServerHash > -1 && data.serverHash > -1 && data.serverHash !== lastServerHash) {
		socket.disconnect();
		store.commit("isConnected", false);
		store.commit("currentUserVisibleError", "Server restarted, reloading…");
		location.reload(true);
		return;
	}

	if (data.serverHash > -1) {
		lastServerHash = data.serverHash;
	} else {
		getActiveWindowComponent().inFlight = false;
	}

	let token;
	const user = storage.get("user");

	if (!data.success) {
		if (store.state.activeWindow !== "SignIn") {
			socket.disconnect();
			store.commit("isConnected", false);
			store.commit("currentUserVisibleError", "Authentication failed, reloading…");
			location.reload();
			return;
		}

		storage.remove("token");

		getActiveWindowComponent().errorShown = true;
	} else if (user) {
		token = storage.get("token");

		if (token) {
			store.commit("currentUserVisibleError", "Authorizing…");
			$("#loading-page-message").text(store.state.currentUserVisibleError);

			let lastMessage = -1;

			for (const network of store.state.networks) {
				for (const chan of network.channels) {
					if (chan.messages.length > 0) {
						const id = chan.messages[chan.messages.length - 1].id;

						if (lastMessage < id) {
							lastMessage = id;
						}
					}
				}
			}

			const openChannel =
				(store.state.activeChannel && store.state.activeChannel.channel.id) || null;

			socket.emit("auth", {user, token, lastMessage, openChannel});
		}
	}

	if (token) {
		return;
	}

	$("#loading").remove();
	$("#footer")
		.find(".sign-in")
		.trigger("click", {
			pushState: false,
		});
});
