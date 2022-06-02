import socket from "../socket";
import storage from "../localStorage";
import {router, navigate} from "../router";
import {store} from "../store";
import location from "../location";
let lastServerHash: number | null = null;

declare global {
	interface Window {
		g_TheLoungeRemoveLoading: () => void;
	}
}

socket.on("auth:success", function () {
	store.commit("currentUserVisibleError", "Loading messages…");
	updateLoadingMessage();
});

socket.on("auth:failed", async function () {
	storage.remove("token");

	if (store.state.appLoaded) {
		return reloadPage("Authentication failed, reloading…");
	}

	await showSignIn();
});

socket.on("auth:start", async function (serverHash) {
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

		socket.emit("auth:perform", {
			user,
			token,
			lastMessage,
			openChannel,
			hasConfig: store.state.serverConfiguration !== null,
		});
	} else {
		await showSignIn();
	}
});

async function showSignIn() {
	// TODO: this flashes grey background because it takes a little time for vue to mount signin
	if (window.g_TheLoungeRemoveLoading) {
		window.g_TheLoungeRemoveLoading();
	}

	if (router.currentRoute.value.name !== "SignIn") {
		await navigate("SignIn");
	}
}

function reloadPage(message: string) {
	socket.disconnect();
	store.commit("currentUserVisibleError", message);
	location.reload();
}

function updateLoadingMessage() {
	const loading = document.getElementById("loading-page-message");

	if (loading) {
		loading.textContent = store.state.currentUserVisibleError;
	}
}
