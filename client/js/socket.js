"use strict";

const $ = require("jquery");
const io = require("socket.io-client");

const socket = io({
	transports: $(document.body).data("transports"),
	path: window.location.pathname + "socket.io/",
	autoConnect: false,
	reconnection: !$(document.body).hasClass("public"),
});

module.exports = socket;

const store = require("./store").default;

socket.on("disconnect", handleDisconnect);
socket.on("connect_error", handleDisconnect);
socket.on("error", handleDisconnect);

socket.on("reconnecting", function(attempt) {
	store.commit("currentUserVisibleError", `Reconnecting… (attempt ${attempt})`);
	$("#loading-page-message").text(store.state.currentUserVisibleError);
});

socket.on("connecting", function() {
	store.commit("currentUserVisibleError", `Connecting…`);
	$("#loading-page-message").text(store.state.currentUserVisibleError);
});

socket.on("connect", function() {
	// Clear send buffer when reconnecting, socket.io would emit these
	// immediately upon connection and it will have no effect, so we ensure
	// nothing is sent to the server that might have happened.
	socket.sendBuffer = [];

	store.commit("currentUserVisibleError", "Finalizing connection…");
	$("#loading-page-message").text(store.state.currentUserVisibleError);
});

function handleDisconnect(data) {
	const message = data.message || data;

	store.commit("isConnected", false);

	store.commit("currentUserVisibleError", `Waiting to reconnect… (${message})`);
	$("#loading-page-message").text(store.state.currentUserVisibleError);

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
