"use strict";
const $ = require("jquery");
const socket = require("../socket");
const utils = require("../utils");

const input = $("#input");
const chat = $("#chat");

$("#form").on("submit", function(e) {
	e.preventDefault();
	utils.forceFocus();
	var text = input.val();

	if (text.length === 0) {
		return;
	}

	input.val("");
	utils.resetHeight(input.get(0));

	if (text.indexOf("/clear") === 0) {
		utils.clear();
		return;
	}

	socket.emit("input", {
		target: chat.data("id"),
		text: text
	});
});
