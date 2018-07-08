"use strict";

const $ = require("jquery");
const io = require("socket.io-client");

const socket = io({
	transports: $(document.body).data("transports"),
	path: window.location.pathname + "socket.io/",
	autoConnect: false,
	reconnection: !$(document.body).hasClass("public"),
});

$("#connection-error").on("click", function() {
	$(this).removeClass("shown");
});

socket.on("disconnect", handleDisconnect);
socket.on("connect_error", handleDisconnect);
socket.on("error", handleDisconnect);

socket.on("reconnecting", function(attempt) {
	$("#loading-page-message, #connection-error").text(`Reconnecting… (attempt ${attempt})`);
});

socket.on("connecting", function() {
	$("#loading-page-message, #connection-error").text("Connecting…");
});

socket.on("connect", function() {
	// Clear send buffer when reconnecting, socket.io would emit these
	// immediately upon connection and it will have no effect, so we ensure
	// nothing is sent to the server that might have happened.
	socket.sendBuffer = [];

	$("#loading-page-message, #connection-error").text("Finalizing connection…");
});

socket.on("authorized", function() {
	$("#loading-page-message, #connection-error").text("Loading messages…");
});

function handleDisconnect(data) {
	const message = data.message || data;

	$("#loading-page-message, #connection-error").text(`Waiting to reconnect… (${message})`).addClass("shown");
	$(".show-more button, #input").prop("disabled", true);
	$("#submit").hide();
	$("#upload").hide();

	// If the server shuts down, socket.io skips reconnection
	// and we have to manually call connect to start the process
	if (socket.io.skipReconnect) {
		const utils = require("./utils");
		utils.requestIdleCallback(() => socket.connect(), 2000);
	}
}

module.exports = socket;
