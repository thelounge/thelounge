"use strict";

const $ = require("jquery");
const renderPreview = require("../renderPreview");
const socket = require("../socket");

socket.on("msg:preview", function(data) {
	const msg = $("#msg-" + data.id);

	renderPreview(data.preview, msg);
});
