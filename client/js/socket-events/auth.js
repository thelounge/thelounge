"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");
const utils = require("../utils");
const templates = require("../../views");
const {vueApp} = require("../vue");

socket.on("auth", function(data) {
	// If we reconnected and serverHash differs, that means the server restarted
	// And we will reload the page to grab the latest version
	if (utils.serverHash > -1 && data.serverHash > -1 && data.serverHash !== utils.serverHash) {
		socket.disconnect();
		vueApp.connected = false;
		vueApp.connectionError = "Server restarted, reloading…";
		location.reload(true);
		return;
	}

	const login = $("#sign-in");

	if (data.serverHash > -1) {
		utils.serverHash = data.serverHash;

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
			vueApp.connected = false;
			vueApp.connectionError = "Authentication failed, reloading…";
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
			vueApp.connectionError = "Authorizing…";
			$("#loading-page-message").text(vueApp.connectionError);

			let lastMessage = -1;

			for (const network of vueApp.networks) {
				for (const chan of network.channels) {
					for (const msg of chan.messages) {
						if (msg.id > lastMessage) {
							lastMessage = msg.id;
						}
					}
				}
			}

			socket.emit("auth", {user, token, lastMessage});
		}
	}

	if (user) {
		login.find("input[name='user']").val(user);
	}

	if (token) {
		return;
	}

	$("#loading").remove();
	$("#footer")
		.find(".sign-in")
		.trigger("click", {
			pushState: false,
		});
});
