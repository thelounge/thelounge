"use strict";

import socket from "../socket";
import store from "../store";
import location from "../location";

socket.on("disconnect", handleDisconnect);
socket.on("connect_error", handleError);
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

function handleError(data) {
	// We are checking if the server configuration is null because if it is null, then the client
	// never loaded properly and there's a different issue than 401 on the header auth
	if (
		store.state.serverConfiguration !== null &&
		store.state.serverConfiguration.headerAuthEnabled
	) {
		location.reload(true);
	}

	handleDisconnect(data);
}

function handleDisconnect(data) {
	const message = data.message || data;

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
