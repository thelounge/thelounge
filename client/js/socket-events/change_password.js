"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");

socket.on("change-password", function(data) {
	const passwordForm = $("#change-password");
	if (data.error || data.success) {
		const message = data.success ? data.success : data.error;
		const feedback = passwordForm.find(".feedback");

		if (data.success) {
			feedback.addClass("success").removeClass("error");
		} else {
			feedback.addClass("error").removeClass("success");
		}

		feedback.text(message).show();
		feedback.closest("form").one("submit", function() {
			feedback.hide();
		});
	}

	if (data.token && storage.get("token") !== null) {
		storage.set("token", data.token);
	}

	passwordForm
		.find("input")
		.val("")
		.end()
		.find(".btn")
		.prop("disabled", false);
});
