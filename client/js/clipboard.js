"use strict";

const $ = require("jquery");

function copyMessages(event) {
	// Get the selected text
	const selection = window.getSelection();
	var copyParts = [];
	var copyText = "";

	if (selection.anchorNode === selection.focusNode) {
		// Selection does not span nodes
		if (selection.focusNode.parentElement.classList.contains("clipboard")) {
			// Selection is inside an element that has the clipboard class
			copyText = selection.toString();
		}
	} else {
		// Selection does span nodes
		const range = selection.getRangeAt(0);
		const documentFragment = range.cloneContents();
		const parts = documentFragment.querySelectorAll(".clipboard");

		parts.forEach(function(part) {
			copyParts.push(part.innerText);
		});

		copyText = copyParts.join("");
	}

	(event.originalEvent.clipboardData || window.clipboardData).setData("Text", copyText);
	event.preventDefault();
}

$("#chat").on("copy", ".messages", copyMessages);
