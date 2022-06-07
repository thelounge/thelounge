import {store} from "../store";
import socket from "../socket";

socket.on("disconnect", handleDisconnect);
socket.on("connect_error", handleDisconnect);
socket.on("error", handleDisconnect);

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

	store.commit("currentUserVisibleError", "Finalizing connection…");
	updateLoadingMessage();
});

function handleDisconnect(data) {
	const message = String(data.message || data);

	store.commit("isConnected", false);

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
