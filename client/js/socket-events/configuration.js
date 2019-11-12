"use strict";

const $ = require("jquery");
const socket = require("../socket");
const upload = require("../upload");
const store = require("../store").default;
const router = require("../router");

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

socket.once("configuration", function(data) {
	store.commit("serverConfiguration", data);

	// 'theme' setting depends on serverConfiguration.themes so
	// settings cannot be applied before this point
	store.dispatch("settings/applyAll");
	socket.emit("setting:get");

	if (data.fileUpload) {
		upload.initialize();
	}

	router.initialize();

	// If localStorage contains a theme that does not exist on this server, switch
	// back to its default theme.
	const currentTheme = data.themes.find((t) => t.name === store.state.settings.theme);

	if (currentTheme === undefined) {
		store.commit("settings/update", {name: "theme", value: data.defaultTheme, sync: true});
	} else if (currentTheme.themeColor) {
		document.querySelector('meta[name="theme-color"]').content = currentTheme.themeColor;
	}

	if (document.body.classList.contains("public")) {
		window.addEventListener(
			"beforeunload",
			() => "Are you sure you want to navigate away from this page?"
		);
	}
});
