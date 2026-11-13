import {store} from "../store";
import socket, {tryAgainMessage} from "../socket";

const disconnectionTypes = ["disconnect", "connect_error", "error"] as const;
type DisconnectionType = typeof disconnectionTypes[number];

for (const type of disconnectionTypes) {
	socket.on(type, (data) => {
		handleDisconnect(type, data);
	});
}

socket.io.on("reconnect_attempt", function (attempt) {
	store.commit("currentUserVisibleError", `Reconnecting… (attempt ${attempt})`);
	updateLoadingMessage();
});

socket.on("connecting", function () {
	store.commit("currentUserVisibleError", "Connecting…");
	updateLoadingMessage();
});

socket.on("connect", function () {
	// Clear send buffer when reconnecting, socket.io would emit these
	// immediately upon connection and it will have no effect, so we ensure
	// nothing is sent to the server that might have happened.
	socket.sendBuffer = [];

	// If previously disconnected due to auth failure (i.e. private instance)
	// and subsequently able to reconnect, reset state
	if (store.state.authFailure === "disconnected") {
		store.commit("authFailure", null);
		socket.io.reconnection(true);
	}

	store.commit("currentUserVisibleError", "Finalizing connection…");
	updateLoadingMessage();
});

function handleDisconnect(type: DisconnectionType, data) {
	const message = String(data.message || data);

	store.commit("isConnected", false);

	// Prevent auto-reconnecting if disconnected after auth failures (e.g. fail2ban)
	if (store.state.authFailure === "failed") {
		if ((type === "disconnect" && message === "transport error") || type === "connect_error") {
			store.commit("authFailure", "disconnected");
		}
	}

	// Note: This is intentionally not an else if;
	// this can apply directly after the preceding "failed" case
	if (store.state.authFailure === "disconnected") {
		store.commit("currentUserVisibleError", tryAgainMessage);
		// Disable auto-reconnect, which may unwittingly prolong a block
		socket.io.reconnection(false);
		updateLoadingMessage();
		return;
	}

	if (!socket.io.reconnection()) {
		store.commit(
			"currentUserVisibleError",
			`Disconnected from the server (${message}), The Lounge does not reconnect in public mode.`
		);
		updateLoadingMessage();
		return;
	}

	store.commit("currentUserVisibleError", `Waiting to reconnect… (${message})`);
	updateLoadingMessage();

	// If the server shuts down, socket.io skips reconnection
	// and we have to manually call connect to start the process
	// However, do not reconnect if TL client manually closed the connection
	// @ts-expect-error Property 'skipReconnect' is private and only accessible within class 'Manager<ListenEvents, EmitEvents>'.ts(2341)
	if (socket.io.skipReconnect && message !== "io client disconnect") {
		requestIdleCallback(() => socket.connect(), 2000);
	}
}

function requestIdleCallback(callback, timeout) {
	if (window.requestIdleCallback) {
		// During an idle period the user agent will run idle callbacks in FIFO order
		// until either the idle period ends or there are no more idle callbacks eligible to be run.
		window.requestIdleCallback(callback, {timeout});
	} else {
		callback();
	}
}

function updateLoadingMessage() {
	const loading = document.getElementById("loading-page-message");

	if (loading) {
		loading.textContent = store.state.currentUserVisibleError;
	}
}
