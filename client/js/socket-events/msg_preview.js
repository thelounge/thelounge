"use strict";

const $ = require("jquery");
const Handlebars = require("handlebars/runtime");
const renderPreview = require("../renderPreview");
const socket = require("../socket");

socket.on("msg:preview", function(data) {
	const msg = $("#msg-" + data.id);

	data.link = Handlebars.Utils.escapeExpression(data.link);
	renderPreview(data.preview, msg);
});
