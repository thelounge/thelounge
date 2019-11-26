"use strict";

import io from "socket.io-client";

const socket = io({
	transports: JSON.parse(document.body.dataset.transports),
	path: window.location.pathname + "socket.io/",
	autoConnect: false,
	reconnection: !document.body.classList.contains("public"),
});

// Ease debugging socket during development
if (process.env.NODE_ENV === "development") {
	window.socket = socket;
}

export default socket;
