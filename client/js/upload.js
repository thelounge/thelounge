"use strict";

const $ = require("jquery");
const socket = require("./socket");
const SocketIOFileUpload = require("socketio-file-upload/client");
const instance = new SocketIOFileUpload(socket);
const {vueApp} = require("./vue");

function initialize() {
	instance.listenOnInput(document.getElementById("upload-input"));
	instance.listenOnDrop(document);

	instance.addEventListener("complete", () => {
		// Reset progressbar
		$("#upload-progressbar").width(0);
	});

	instance.addEventListener("progress", (event) => {
		const percent = `${((event.bytesLoaded / event.file.size) * 100)}%`;
		$("#upload-progressbar").width(percent);
	});

	instance.addEventListener("error", (event) => {
		// Reset progressbar
		$("#upload-progressbar").width(0);
		vueApp.connectionError = event.message;
	});

	const $form = $(document);
	const $overlay = $("#upload-overlay");

	$form.on("dragover", () => {
		$overlay.addClass("is-dragover");
		return false;
	});

	$form.on("dragend dragleave drop", () => {
		$overlay.removeClass("is-dragover");
		return false;
	});
}

/**
* Called in the `configuration` socket event.
* Makes it so the user can be notified if a file is too large without waiting for the upload to finish server-side.
**/
function setMaxFileSize(kb) {
	instance.maxFileSize = kb;
}

module.exports = {initialize, setMaxFileSize};
