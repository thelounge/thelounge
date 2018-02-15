"use strict";

const socket = require("../socket");

socket.on("logs:download", function(data) {
	downloadFile(data.filename, data.content);
});

function downloadFile(filename, text) {
	const element = document.createElement("a");
	element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
	element.setAttribute("download", filename);

	element.style.display = "none";
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
