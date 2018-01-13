"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");
const templates = require("../../views");

socket.on("sign-up", function(data) {
	const signup = $("#sign-up");

	signup.html(templates.windows.sign_up());

	signup.find("form").on("submit", function() {
		const form = $(this);

		form.find(".btn").attr("disabled", true);

		const values = {};
		$.each(form.serializeArray(), function(i, obj) {
			values[obj.name] = obj.value;
		});

		storage.set("user", values.user);

		socket.emit("sign-up", values);

		return false;
	});

	signup.find("#signup-signin").on("click", function() {
		$("#footer")
			.find(".sign-in")
			.trigger("click", {
				pushState: false,
			});
	});
	if (!data.success) {
		const error = signup.find(".error");
		error.show().closest("form").one("submit", function() {
			error.hide();
		});
	} else {
		signup.find(".success").show();
	}
});
