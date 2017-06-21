"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");

socket.on("auth", function(data) {
	const login = $("#sign-in");
	let token;
	const user = storage.get("user");

	login.find(".btn").prop("disabled", false);

	if (!data.success) {
		storage.remove("token");

		const error = login.find(".error");
		error.show().closest("form").one("submit", function() {
			error.hide();
		});
	} else if (user) {
		token = storage.get("token");
		if (token) {
			$("#loading-page-message").text("Authorizing…");
			socket.emit("auth", {user: user, token: token});
		}
	}

	if (user) {
		login.find("input[name='user']").val(user);
	}

	if (token) {
		return;
	}

	$("#footer").find(".sign-in")
		.trigger("click", {
			pushState: false,
		})
		.end()
		.find(".networks")
		.html("")
		.next()
		.show();
});
