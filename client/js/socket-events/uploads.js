"use strict";

const socket = require("../socket");
const wrapCursor = require("undate").wrapCursor;

socket.on("upload:success", (url) => {
	const fullURL = new URL(url, location);
	const textbox = document.getElementById("input");
	wrapCursor(textbox, fullURL, " ");
});
