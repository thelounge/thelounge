"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");
const utils = require("../utils");
const templates = require("../../views");

socket.on("configuration", function(data) {
	$("#settings").html(templates.windows.settings(data));
	$("#connect").html(templates.windows.connect(data));

	require("../options");
});
