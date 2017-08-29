"use strict";

const $ = require("jquery");
const io = require("socket.io-client");
const path = window.location.pathname + "socket.io/";

const socket = io({
	transports: $(document.body).data("transports"),
	path: path,
	autoConnect: false,
	reconnection: false
});

[
	"connect_error",
	"connect_failed",
	"disconnect",
	"error",
].forEach(function(e) {
	socket.on(e, function(data) {
		$("#loading-page-message").text("Connection failed: " + data);
		$("#connection-error").addClass("shown").one("click", function() {
			window.onbeforeunload = null;
			window.location.reload();
		});

		// Disables sending a message by pressing Enter. `off` is necessary to
		// cancel `inputhistory`, which overrides hitting Enter. `on` is then
		// necessary to avoid creating new lines when hitting Enter without Shift.
		// This is fairly hacky but this solution is not permanent.
		$("#input").off("keydown").on("keydown", function(event) {
			if (event.which === 13 && !event.shiftKey) {
				event.preventDefault();
			}
		});
		// Hides the "Send Message" button
		$("#submit").remove();

		console.error(data);
	});
});

socket.on("connecting", function() {
	$("#loading-page-message").text("Connecting…");
});

socket.on("connect", function() {
	$("#loading-page-message").text("Finalizing connection…");
});

socket.on("authorized", function() {
	$("#loading-page-message").text("Authorized, loading messages…");
});

module.exports = socket;
