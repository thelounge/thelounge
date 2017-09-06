"use strict";

const $ = require("jquery");
const renderPreview = require("../renderPreview");
const socket = require("../socket");
const utils = require("../utils");

socket.on("msg:preview", function(data) {
	// Previews are not as important, we can wait longer for them to appear
	utils.requestIdleCallback(() => renderPreview(data.preview, $("#msg-" + data.id)), 6000);
});
