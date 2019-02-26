"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");
const utils = require("../utils");
const {vueApp, getActiveWindowComponent} = require("../vue");

socket.on("auth", function(data) {
	// If we reconnected and serverHash differs, that means the server restarted
	// And we will reload the page to grab the latest version
	if (utils.serverHash > -1 && data.serverHash > -1 && data.serverHash !== utils.serverHash) {
		socket.disconnect();
		vueApp.$store.commit("isConnected", false);
		vueApp.currentUserVisibleError = "Server restarted, reloading…";
		location.reload(true);
		return;
	}

	if (data.serverHash > -1) {
		utils.serverHash = data.serverHash;

		vueApp.activeWindow = "SignIn";
	} else {
		getActiveWindowComponent().inFlight = false;
	}

	let token;
	const user = storage.get("user");

	if (!data.success) {
		if (vueApp.activeWindow !== "SignIn") {
			socket.disconnect();
			vueApp.$store.commit("isConnected", false);
			vueApp.currentUserVisibleError = "Authentication failed, reloading…";
			location.reload();
			return;
		}

		storage.remove("token");

		getActiveWindowComponent().errorShown = true;
	} else if (user) {
		token = storage.get("token");

		if (token) {
			vueApp.currentUserVisibleError = "Authorizing…";
			$("#loading-page-message").text(vueApp.currentUserVisibleError);

			let lastMessage = -1;

			for (const network of vueApp.networks) {
				for (const chan of network.channels) {
					if (chan.messages.length > 0) {
						const id = chan.messages[chan.messages.length - 1].id;

						if (lastMessage < id) {
							lastMessage = id;
						}
					}
				}
			}

			const openChannel = (vueApp.activeChannel && vueApp.activeChannel.channel.id) || null;

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
