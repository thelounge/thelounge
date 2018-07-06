"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");
const utils = require("../utils");
const templates = require("../../views");

socket.on("auth", function(data) {
	// If we reconnected and serverHash differs, that means the server restarted
	// And we will reload the page to grab the latest version
	if (utils.serverHash > -1 && data.serverHash > -1 && data.serverHash !== utils.serverHash) {
		socket.disconnect();
		$("#connection-error").text("Server restarted, reloading…");
		location.reload(true);
		return;
	}

	const login = $("#sign-in");

	if (data.serverHash > -1) {
		utils.serverHash = data.serverHash;

		$("#loading").remove();
		login.html(templates.windows.sign_in());

		utils.togglePasswordField("#sign-in .reveal-password");

		login.find("form").on("submit", function() {
			const form = $(this);

			form.find(".btn").prop("disabled", true);

			const values = {};
			$.each(form.serializeArray(), function(i, obj) {
				values[obj.name] = obj.value;
			});

			storage.set("user", values.user);

			socket.emit("auth", values);

			return false;
		});
	} else {
		login.find(".btn").prop("disabled", false);
	}

	let token;
	const user = storage.get("user");

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
			const lastMessage = utils.lastMessageId;
			socket.emit("auth", {user, token, lastMessage});
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
