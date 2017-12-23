"use strict";

const $ = require("jquery");
const socket = require("../socket");
const templates = require("../../views");

socket.on("changelog", function(data) {
	const container = $("#changelog-version-container");

	if (data.latest) {
		container.addClass("new-version");
		container.html(templates.new_version(data));
	} else if (data.current.changelog) {
		container.addClass("up-to-date");
		container.text("The Lounge is up to date!");
	} else {
		container.addClass("error");
		container.text("An error has occurred, try to reload the page.");
	}

	$("#changelog").html(templates.windows.changelog(data));
});
