"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");
const {getActiveWindowComponent} = require("../vue");
const store = require("../store").default;
let lastServerHash = null;

socket.on("auth:success", function() {
	store.commit("currentUserVisibleError", "Loading messages…");
	updateLoadingMessage();
});

socket.on("auth:failed", function() {
	storage.remove("token");

	if (store.state.appLoaded) {
		return reloadPage("Authentication failed, reloading…");
	}

	// TODO: This will most likely fail getActiveWindowComponent
	showSignIn();

	// TODO: getActiveWindowComponent is the SignIn component, find a better way to set this
	getActiveWindowComponent().errorShown = true;
	getActiveWindowComponent().inFlight = false;
});

socket.on("auth:start", function(serverHash) {
	// If we reconnected and serverHash differs, that means the server restarted
	// And we will reload the page to grab the latest version
	if (lastServerHash && serverHash !== lastServerHash) {
		return reloadPage("Server restarted, reloading…");
	}

	lastServerHash = serverHash;

	const user = storage.get("user");
	const token = storage.get("token");
	const doFastAuth = user && token;

	// If we reconnect and no longer have a stored token, reload the page
	if (store.state.appLoaded && !doFastAuth) {
		return reloadPage("Authentication failed, reloading…");
	}

	// If we have user and token stored, perform auth without showing sign-in first
	if (doFastAuth) {
		store.commit("currentUserVisibleError", "Authorizing…");
		updateLoadingMessage();

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

		socket.emit("auth:perform", {user, token, lastMessage, openChannel});
	} else {
		showSignIn();
	}
});

function showSignIn() {
	// TODO: this flashes grey background because it takes a little time for vue to mount signin
	if (window.g_TheLoungeRemoveLoading) {
		window.g_TheLoungeRemoveLoading();
	}

	$("#footer")
		.find(".sign-in")
		.trigger("click", {
			pushState: false,
		});
}

function reloadPage(message) {
	socket.disconnect();
	store.commit("currentUserVisibleError", message);
	location.reload(true);
}

function updateLoadingMessage() {
	const loading = document.getElementById("loading-page-message");

	if (loading) {
		loading.textContent = store.state.currentUserVisibleError;
	}
}
