import {store} from "../store";
import socket from "../socket";

socket.on("disconnect", handleDisconnect);
socket.on("connect_error", handleConnectError);
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

function handleConnectError(data) {
	const message = String(data.message || data);

	if (store.state.isAuthFailure) {
		return updateErrorMessageAndExit(
			`Disconnected from the server. Please close the tab and try again later.`
		);
	}

	return handleDisconnect(data);
}

function handleDisconnect(data) {
	const message = String(data.message || data);

	store.commit("isConnected", false);

	if (store.state.disableReconnection) {
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

function updateErrorMessageAndExit(message: string) {
	socket.disconnect();
	store.commit("disableReconnection", true);

	// display server unavailable message and disable login button
	const parentDOM = document.getElementById("sign-in");

	if (parentDOM) {
		const error = parentDOM.getElementsByClassName("error")[0];

		if (error) {
			error.textContent = message;
		}

		const button = parentDOM.getElementsByClassName("btn")[0];

		if (button) {
			button.setAttribute("disabled", "");
		}
	}

	// tell serviceWorker to discard fetch requests
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.ready
			.then((registration) => {
				registration.active?.postMessage({type: "shutdown"});
				registration
					.unregister()
					.catch((e) => {
						// couldn't communicate with the service-worker
					});
			})
			.catch((e) => {
				// couldn't communicate with the service-worker
			});
	}
}
