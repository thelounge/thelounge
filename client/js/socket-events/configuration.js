"use strict";

const $ = require("jquery");
const socket = require("../socket");
const webpush = require("../webpush");
const upload = require("../upload");
const store = require("../store").default;
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

socket.once("configuration", function(data) {
	store.commit("isFileUploadEnabled", data.fileUpload);
	store.commit("serverConfiguration", data);

	// 'theme' setting depends on serverConfiguration.themes so
	// settings cannot be applied before this point
	store.dispatch("settings/applyAll");

	if (data.fileUpload) {
		upload.initialize(data.fileUploadMaxFileSize);
	}

	socket.emit("setting:get");
	webpush.initialize();

	// If localStorage contains a theme that does not exist on this server, switch
	// back to its default theme.
	const currentTheme = data.themes.find((t) => t.name === store.state.settings.theme);

	if (currentTheme === undefined) {
		store.commit("settings/update", {name: "theme", value: data.defaultTheme, sync: true});
	} else if (currentTheme.themeColor) {
		document.querySelector('meta[name="theme-color"]').content = currentTheme.themeColor;
	}

	if ("URLSearchParams" in window) {
		const params = new URLSearchParams(document.location.search);

		const cleanParams = () => {
			// Remove query parameters from url without reloading the page
			const cleanUri =
				window.location.origin + window.location.pathname + window.location.hash;
			window.history.replaceState({}, document.title, cleanUri);
		};

		if (params.has("uri")) {
			// Set default connection settings from IRC protocol links
			const uri =
				params.get("uri") +
				(location.hash.includes("#/") ? location.hash.split("#/")[0] : location.hash);
			const queryParams = parseIrcUri(uri, data);
			cleanParams();
			vueApp.$router.push({path: "/connect", query: queryParams});
		} else if (document.body.classList.contains("public") && document.location.search) {
			// Set default connection settings from url params
			const queryParams = document.location.search;
			cleanParams();
			vueApp.$router.push("/connect" + queryParams);
		}
	}
});

function parseIrcUri(stringUri) {
	const data = {};

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
	} catch (e) {
		// do nothing on invalid uri
	}

	return data;
}
