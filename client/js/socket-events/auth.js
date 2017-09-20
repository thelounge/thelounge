"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");
const utils = require("../utils");

socket.on("auth", function(data) {
	// If we reconnected and serverHash differs, that means the server restarted
	// And we will reload the page to grab the latest version
	if (utils.serverHash > -1 && data.serverHash > -1 && data.serverHash !== utils.serverHash) {
		socket.disconnect();
		$("#connection-error").text("Server restarted, reloading…");
		location.reload(true);
		return;
	}

	utils.serverHash = data.serverHash;

	const login = $("#sign-in");
	let token;
	const user = storage.get("user");

	login.find(".btn").prop("disabled", false);

	if (!data.success) {
		if (login.length === 0) {
			socket.disconnect();
			$("#connection-error").text("Authentication failed, reloading…");
			location.reload();
			return;
		}

		storage.remove("token");

		const error = login.find(".error");
		error.show().closest("form").one("submit", function() {
			error.hide();
		});
	} else if (user) {
		token = storage.get("token");

		if (token) {
			$("#loading-page-message, #connection-error").text("Authorizing…");

			socket.emit("auth", {
				user: user,
				token: token,
				lastMessage: utils.lastMessageId,
			});
		}
	}

	if (user) {
		login.find("input[name='user']").val(user);
	}

	if (token) {
		return;
	}

	$("#footer")
		.find(".sign-in")
		.trigger("click", {
			pushState: false,
		});
});
