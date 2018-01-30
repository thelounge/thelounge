"use strict";

const $ = require("jquery");
const socket = require("../socket");
const templates = require("../../views");

module.exports = {
	requestIfNeeded,
};

// Requests version information if it hasn't been retrieved before (or if it has
// been removed from the page, i.e. when clicking on "Check now". Displays a
// loading state until received.
function requestIfNeeded() {
	if ($("#version-checker").is(":empty")) {
		renderVersionChecker({status: "loading"});
		socket.emit("changelog");
	}
}

socket.on("changelog", function(data) {
	// 1. Release notes window for the current version
	$("#changelog").html(templates.windows.changelog(data.current));

	const links = $("#changelog .changelog-text a");
	// Make sure all links will open a new tab instead of exiting the application
	links.prop("target", "_blank");
	// Add required metadata to image links, to support built-in image viewer
	links.has("img").addClass("toggle-thumbnail");

	// 2. Version checker visible in Help window
	let status;

	if (data.latest) {
		status = "new-version";
	} else if (data.current.changelog) {
		status = "up-to-date";
	} else {
		status = "error";
	}

	renderVersionChecker({
		latest: data.latest,
		status,
	});

	// When there is a button to refresh the checker available, display it when
	// data is expired. Before that, server would return same information anyway.
	if (data.expiresAt) {
		setTimeout(
			() => $("#version-checker #check-now").show(),
			data.expiresAt - Date.now()
		);
	}
});

// When clicking the "Check now" button, remove current checker information and
// request a new one. Loading will be displayed in the meantime.
$("#help").on("click", "#check-now", () => {
	$("#version-checker").empty();
	requestIfNeeded();
});

// Given a status and latest release information, update the version checker
// (CSS class and content)
function renderVersionChecker({status, latest}) {
	$("#version-checker").prop("class", status)
		.html(templates.version_checker({latest, status}));
}
