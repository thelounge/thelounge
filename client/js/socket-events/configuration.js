"use strict";

const $ = require("jquery");
const socket = require("../socket");
const templates = require("../../views");
const options = require("../options");
const webpush = require("../webpush");
const connect = $("#connect");
const utils = require("../utils");

socket.on("configuration", function(data) {
	if (options.initialized) {
		// Likely a reconnect, request sync for possibly missed settings.
		socket.emit("setting:get");
		return;
	}

	$("#settings").html(templates.windows.settings(data));
	$("#help").html(templates.windows.help(data));
	$("#changelog").html(templates.windows.changelog());

	$("#settings").on("show", () => {
		$("#session-list").html("<p>Loading…</p>");
		socket.emit("sessions:get");
	});

	$("#play").on("click", () => {
		const pop = new Audio();
		pop.src = "audio/pop.ogg";
		pop.play();
	});

	utils.togglePasswordField("#change-password .reveal-password");

	options.initialize();
	webpush.initialize();

	// If localStorage contains a theme that does not exist on this server, switch
	// back to its default theme.
	if (!data.themes.map((t) => t.name).includes(options.settings.theme)) {
		options.processSetting("theme", data.defaultTheme, true);
	}

	function handleFormSubmit() {
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
	}

	$("#change-password form").on("submit", handleFormSubmit);
	connect.on("submit", "form", handleFormSubmit);

	connect.on("show", function() {
		connect
			.html(templates.windows.connect(data))
			.find("#connect\\:nick")
			.on("focusin", function() {
				// Need to set the first "lastvalue", so it can be used in the below function
				const nick = $(this);
				nick.data("lastvalue", nick.val());
			})
			.on("input", function() {
				const nick = $(this).val();
				const usernameInput = connect.find(".username");

				// Because this gets called /after/ it has already changed, we need use the previous value
				const lastValue = $(this).data("lastvalue");

				// They were the same before the change, so update the username field
				if (usernameInput.val() === lastValue) {
					usernameInput.val(nick);
				}

				// Store the "previous" value, for next time
				$(this).data("lastvalue", nick);
			});

		utils.togglePasswordField("#connect .reveal-password");
	});

	if ($(document.body).hasClass("public") && "URLSearchParams" in window) {
		const params = new URLSearchParams(document.location.search);

		for (let [key, value] of params) {
			// Support `channels` as a compatibility alias with other clients
			if (key === "channels") {
				key = "join";
			}

			if (!data.defaults.hasOwnProperty(key)) {
				continue;
			}

			if (key === "join") {
				value = value.split(",").map((chan) => {
					if (!chan.match(/^[#&!+]/)) {
						return `#${chan}`;
					}

					return chan;
				}).join(", ");
			}

			// Override server provided defaults with parameters passed in the URL if they match the data type
			switch (typeof data.defaults[key]) {
			case "boolean": data.defaults[key] = value === "1" || value === "true"; break;
			case "number": data.defaults[key] = Number(value); break;
			case "string": data.defaults[key] = String(value); break;
			}
		}
	}
});
