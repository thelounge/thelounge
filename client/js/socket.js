"use strict";

const $ = require("jquery");
const io = require("socket.io-client");
const path = window.location.pathname + "socket.io/";

const socket = io({
	path: path,
	autoConnect: false,
	timeout: 40000,
	reconnection: true
});

[
	"connect_error",
	"connect_failed",
	"disconnect",
	"error",
].forEach(function(e) {
	socket.on(e, function(data) {
		$("#loading-page-message").text("Connection failed: " + data);
		$("#connection-error").addClass("shown");
		$("#submit").prop("disabled", true);
		$(".show-more-button").prop("disabled", true);
		$("#input").data("disabled", true);

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
