"use strict";
const $ = require("jquery");
const socket = require("../socket");
const templates = require("../../views");
const options = require("../options");

socket.on("toggle", function(data) {
	var toggle = $("#toggle-" + data.id);
	toggle.parent().after(templates.toggle({toggle: data}));
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
