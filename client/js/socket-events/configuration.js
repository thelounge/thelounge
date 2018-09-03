"use strict";

const $ = require("jquery");
const socket = require("../socket");
const templates = require("../../views");
const options = require("../options");
const webpush = require("../webpush");
const connect = $("#connect");
const utils = require("../utils");
const upload = require("../upload");
const {vueApp} = require("../vue");

window.addEventListener("beforeinstallprompt", (installPromptEvent) => {
	$("#webapp-install-button")
		.on("click", function() {
			if (installPromptEvent && installPromptEvent.prompt) {
				installPromptEvent.prompt();
			}

			$(this).prop("hidden", true);
		})
		.prop("hidden", false);

	$("#native-app").prop("hidden", false);
});

socket.on("configuration", function(data) {
	vueApp.fileUploadEnabled = data.fileUpload;

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
		pop.src = "audio/pop.wav";
		pop.play();
	});

	if (data.fileUpload) {
		upload.setMaxFileSize(data.fileUploadMaxFileSize);
	}

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

	if ("URLSearchParams" in window) {
		const params = new URLSearchParams(document.location.search);

		if (params.has("uri")) {
			parseIrcUri(params.get("uri") + location.hash, data);
		} else if ($(document.body).hasClass("public")) {
			parseOverrideParams(params, data);
		}
	}
});

function parseIrcUri(stringUri, defaults) {
	const data = Object.assign({}, defaults.defaults);

	try {
		// https://tools.ietf.org/html/draft-butcher-irc-url-04
		const uri = new URL(stringUri);

		// Replace protocol with a "special protocol" (that's what it's called in WHATWG spec)
		// So that the uri can be properly parsed
		if (uri.protocol === "irc:") {
			uri.protocol = "http:";

			if (!uri.port) {
				uri.port = 6667;
			}

			data.tls = false;
		} else if (uri.protocol === "ircs:") {
			uri.protocol = "https:";

			if (!uri.port) {
				uri.port = 6697;
			}

			data.tls = true;
		} else {
			return;
		}

		data.host = data.name = uri.hostname;
		data.port = uri.port;
		data.username = window.decodeURIComponent(uri.username) || data.username;
		data.password = window.decodeURIComponent(uri.password) || data.password;

		let channel = (uri.pathname + uri.hash).substr(1);
		const index = channel.indexOf(",");

		if (index > -1) {
			channel = channel.substring(0, index);
		}

		data.join = channel;

		// TODO: Need to show connect window with uri params without overriding defaults
		defaults.defaults = data;

		$('button[data-target="#connect"]').trigger("click");
	} catch (e) {
		// do nothing on invalid uri
	}
}

function parseOverrideParams(params, data) {
	for (let [key, value] of params) {
		// Support `channels` as a compatibility alias with other clients
		if (key === "channels") {
			key = "join";
		}

		if (!data.defaults.hasOwnProperty(key)) {
			continue;
		}

		// When the network is locked, URL overrides should not affect disabled fields
		if (data.lockNetwork &&
				["host", "port", "tls", "rejectUnauthorized"].includes(key)) {
			continue;
		}

		// When the network is not displayed, its name in the UI is not customizable
		if (!data.displayNetwork && key === "name") {
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
