"use strict";

const $ = require("jquery");
const socket = require("../socket");
const templates = require("../../views");

socket.on("configuration", function(data) {
	$("#settings").html(templates.windows.settings(data));
	$("#connect").html(templates.windows.connect(data));

	require("../options");
});
