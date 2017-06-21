"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");

socket.on("auth", function(data) {
	const login = $("#sign-in");
	let token;

	login.find(".btn").prop("disabled", false);

	if (!data.success) {
		storage.remove("token");

		const error = login.find(".error");
		error.show().closest("form").one("submit", function() {
			error.hide();
		});
	} else {
		token = storage.get("token");
		if (token) {
			$("#loading-page-message").text("Authorizing…");
			socket.emit("auth", {token: token});
		}
	}

	const input = login.find("input[name='user']");
	if (input.val() === "") {
		input.val(storage.get("user") || "");
	}
	if (token) {
		return;
	}
	$("#sidebar, #footer").find(".sign-in")
		.trigger("click", {
			pushState: false,
		})
		.end()
		.find(".networks")
		.html("")
		.next()
		.show();
});
