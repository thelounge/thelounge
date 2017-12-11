"use strict";

const $ = require("jquery");
const socket = require("../socket");
const templates = require("../../views");
const options = require("../options");
const webpush = require("../webpush");

socket.on("configuration", function(data) {
	if (options.initialized) {
		return;
	}

	$("#settings").html(templates.windows.settings(data));
	$("#connect").html(templates.windows.connect(data));
	$("#help").html(templates.windows.help(data));
	$("#changelog").html(templates.windows.changelog());

	$("#play").on("click", () => {
		const pop = new Audio();
		pop.src = "audio/pop.ogg";
		pop.play();
	});

	options.initialize();
	webpush.initialize();

	const forms = $("#connect form, #change-password form");

	forms.on("submit", function() {
		const form = $(this);
		const event = form.data("event");

		form.find(".btn").prop("disabled", true);

		const values = {};
		$.each(form.serializeArray(), function(i, obj) {
			if (obj.value !== "") {
				values[obj.name] = obj.value;
			}
		});

		socket.emit(event, values);

		return false;
	});

	$(".nick")
		.on("focusin", function() {
			// Need to set the first "lastvalue", so it can be used in the below function
			const nick = $(this);
			nick.data("lastvalue", nick.val());
		})
		.on("input", function() {
			const nick = $(this).val();
			const usernameInput = forms.find(".username");

			// Because this gets called /after/ it has already changed, we need use the previous value
			const lastValue = $(this).data("lastvalue");

			// They were the same before the change, so update the username field
			if (usernameInput.val() === lastValue) {
				usernameInput.val(nick);
			}

			// Store the "previous" value, for next time
			$(this).data("lastvalue", nick);
		});
});
