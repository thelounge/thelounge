"use strict";

const socket = require("../socket");
const updateCursor = require("undate").update;

socket.on("upload:success", (url) => {
	const fullURL = (new URL(url, location)).toString();
	const textbox = document.getElementById("input");
	const initStart = textbox.selectionStart;

	// Get the text before the cursor, and add a space if it's not in the beginning
	const headToCursor = initStart > 0 ? (textbox.value.substr(0, initStart) + " ") : "";

	// Get the remaining text after the cursor
	const cursorToTail = textbox.value.substr(initStart);

	// Construct the value until the point where we want the cursor to be
	const textBeforeTail = headToCursor + fullURL + " ";

	updateCursor(textbox, textBeforeTail + cursorToTail);

	// Set the cursor after the link and a space
	textbox.selectionStart = textbox.selectionEnd = textBeforeTail.length;
});
