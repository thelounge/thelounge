"use strict";
const $ = require("jquery");
const socket = require("../socket");
const utils = require("../utils");

const chat = $("#chat");
const sidebar = $("#sidebar, #footer");

$("button#set-nick").on("click", function() {
	utils.toggleNickEditor(true);

	// Selects existing nick in the editable text field
	var element = document.querySelector("#nick-value");
	element.focus();
	var range = document.createRange();
	range.selectNodeContents(element);
	var selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
});

$("button#cancel-nick").on("click", cancelNick);
$("button#submit-nick").on("click", submitNick);

function submitNick() {
	var newNick = $("#nick-value").text().trim();

	if (newNick.length === 0) {
		cancelNick();
		return;
	}

	utils.toggleNickEditor(false);

	socket.emit("input", {
		target: chat.data("id"),
		text: "/nick " + newNick
	});
}

function cancelNick() {
	utils.setNick(sidebar.find(".chan.active").closest(".network").data("nick"));
}

$("#nick-value").keypress(function(e) {
	switch (e.keyCode ? e.keyCode : e.which) {
	case 13: // Enter
		// Ensures a new line is not added when pressing Enter
		e.preventDefault();
		break;
	}
}).keyup(function(e) {
	switch (e.keyCode ? e.keyCode : e.which) {
	case 13: // Enter
		submitNick();
		break;
	case 27: // Escape
		cancelNick();
		break;
	}
});
