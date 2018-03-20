"use strict";

const $ = require("jquery");
const Auth = require("../auth");
const socket = require("../socket");
const templates = require("../../views");

socket.on("sessions:list", function(data) {
	data.sort((a, b) => b.lastUse - a.lastUse);

	let html = "";
	data.forEach((connection) => {
		if (connection.current) {
			$("#session-current").html(templates.session(connection));
			return;
		}

		html += templates.session(connection);
	});

	if (html.length === 0) {
		html = "<p><em>You are not currently logged in to any other device.</em></p>";
	}

	$("#session-list").html(html);
});

$("#settings").on("click", ".remove-session", function() {
	const token = $(this).data("token");

	if (token) {
		socket.emit("sign-out", token);
	} else {
		socket.emit("sign-out");
		Auth.signout();
	}
});
