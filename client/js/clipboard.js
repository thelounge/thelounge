"use strict";

const $ = require("jquery");

function copyMessages(event) {
	// Get the selected text
	const selection = window.getSelection();
	var copyLines = [];
	var copyText = "";

	if (selection.anchorNode === selection.focusNode) {
		// Selection does not span messages
		copyText = selection.toString();
	} else {
		// Get the first range
		let range = selection.getRangeAt(0);
		let documentFragment = range.cloneContents();
		let messages = documentFragment.querySelectorAll(".msg");

		messages.forEach(function(message) {
			let el = $("#" + message.id);
			if (el) {
				let time = el.find(".time").get(0).innerText;
				let from = "";
				let fromEl = el.find(".from .user").get(0);
				if (fromEl) {
					from = fromEl.innerText;
				}
				let text = el.find(".text").get(0).innerText;
				if (from !== "") {
					copyLines.push(time + " <" + from + "> " + text);
				} else {
					copyLines.push(time + " " + text);
				}
			}
		});

		copyText = copyLines.join("\n");
	}

	(event.originalEvent.clipboardData || window.clipboardData).setData("Text", copyText);
	event.preventDefault();
}

$("#chat").on("copy", ".messages", copyMessages);
