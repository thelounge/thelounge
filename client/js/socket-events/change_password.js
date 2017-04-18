"use strict";
const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");

socket.on("change-password", function(data) {
	var passwordForm = $("#change-password");
	if (data.error || data.success) {
		var message = data.success ? data.success : data.error;
		var feedback = passwordForm.find(".feedback");

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

	if (data.token && window.localStorage.getItem("token") !== null) {
		storage.set("token", data.token);
	}

	passwordForm
		.find("input")
		.val("")
		.end()
		.find(".btn")
		.prop("disabled", false);
});
