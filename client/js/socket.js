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

const {vueApp} = require("./vue");
const {requestIdleCallback} = require("./utils");

socket.on("disconnect", handleDisconnect);
socket.on("connect_error", handleDisconnect);
socket.on("error", handleDisconnect);

socket.on("reconnecting", function(attempt) {
	vueApp.connectionError = `Reconnecting… (attempt ${attempt})`;
	$("#loading-page-message").text(vueApp.connectionError);
});

socket.on("connecting", function() {
	vueApp.connectionError = "Connecting…";
	$("#loading-page-message").text(vueApp.connectionError);
});

socket.on("connect", function() {
	// Clear send buffer when reconnecting, socket.io would emit these
	// immediately upon connection and it will have no effect, so we ensure
	// nothing is sent to the server that might have happened.
	socket.sendBuffer = [];

	vueApp.connectionError = "Finalizing connection…";
	$("#loading-page-message").text(vueApp.connectionError);
});

socket.on("authorized", function() {
	vueApp.connectionError = "Loading messages…";
	$("#loading-page-message").text(vueApp.connectionError);
});

function handleDisconnect(data) {
	const message = data.message || data;

	vueApp.connected = false;
	vueApp.connectionError = `Waiting to reconnect… (${message})`;
	$("#loading-page-message").text(vueApp.connectionError);

	// If the server shuts down, socket.io skips reconnection
	// and we have to manually call connect to start the process
	if (socket.io.skipReconnect) {
		requestIdleCallback(() => socket.connect(), 2000);
	}
}
