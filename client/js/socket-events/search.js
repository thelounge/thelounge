"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const messages = $("#search .results .messages");
const form = $("#search form");

socket.on("search:results", (results) => {
	form.find(".btn").prop("disabled", false);

	messages.html(render.buildChannelMessages($(document.createDocumentFragment()), 0, "search", results.map((msg) => {
		msg = JSON.parse(msg.msg);
		msg.previews = [];
		return msg;
	})));
});
