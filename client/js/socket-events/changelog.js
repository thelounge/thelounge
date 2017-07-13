"use strict";

const $ = require("jquery");
const socket = require("../socket");
const templates = require("../../views");

socket.on("changelog", function(data) {
	$("#changelog").html(templates.windows.changelog(data));
});
