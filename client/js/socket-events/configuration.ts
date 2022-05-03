"use strict";

import socket from "../socket";
import upload from "../upload";
import store from "../store";

socket.once("configuration", function (data) {
	store.commit("serverConfiguration", data);

	// 'theme' setting depends on serverConfiguration.themes so
	// settings cannot be applied before this point
	store.dispatch("settings/applyAll");

	if (data.fileUpload) {
		upload.initialize();
	}

	// If localStorage contains a theme that does not exist on this server, switch
	// back to its default theme.
	const currentTheme = data.themes.find((t) => t.name === store.state.settings.theme);

	if (currentTheme === undefined) {
		store.dispatch("settings/update", {name: "theme", value: data.defaultTheme, sync: true});
	} else if (currentTheme.themeColor) {
		document.querySelector('meta[name="theme-color"]').content = currentTheme.themeColor;
	}

	if (document.body.classList.contains("public")) {
		window.addEventListener("beforeunload", (e) => {
			e.preventDefault();
			e.returnValue = "Are you sure you want to navigate away from this page?";
		});
	}
});
