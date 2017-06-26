"use strict";

const $ = require("jquery");
const socket = require("../socket");
const templates = require("../../views");
const options = require("../options");

socket.on("toggle", function(data) {
	$(`#msg-${data.id}.toggle .text`).append(templates.toggle({toggle: data}));
	const toggle = $(`#toggle-${data.id}`);

	switch (data.type) {
	case "link":
		if (options.links) {
			toggle.click();
		}
		break;

	case "image":
		if (options.thumbnails) {
			toggle.click();
		}
		break;
	}
});
