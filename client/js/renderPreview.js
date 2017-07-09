"use strict";

const $ = require("jquery");

const options = require("./options");
const templates = require("../views");

module.exports = renderPreview;

function renderPreview(preview, msg) {
	preview.shown = options.shouldOpenMessagePreview(preview.type);

	const container = msg.closest(".chat");
	let bottom = false;
	if (container.length) {
		bottom = container.isScrollBottom();
	}

	msg.find(`.text a[href="${preview.link}"]`)
		.first()
		.after(templates.msg_preview_toggle({preview: preview}));

	msg.find(`.preview[data-url="${preview.link}"]`)
		.first()
		.append(templates.msg_preview({preview: preview}));

	if (preview.shown && bottom) {
		handleImageInPreview(msg.find(".toggle-content"), container);
	}

	container.trigger("keepToBottom");
}

$("#chat").on("click", ".toggle-button", function() {
	const self = $(this);
	const container = self.closest(".chat");
	const content = self.closest(".text")
		.find(`.preview[data-url="${self.data("url")}"] .toggle-content`);
	const bottom = container.isScrollBottom();

	if (bottom && !content.hasClass("show")) {
		handleImageInPreview(content, container);
	}

	self.toggleClass("opened");
	content.toggleClass("show");

	// If scrollbar was at the bottom before toggling the preview, keep it at the bottom
	if (bottom) {
		container.scrollBottom();
	}
});

function handleImageInPreview(content, container) {
	const img = content.find("img");

	// Trigger scroll logic after the image loads
	if (img.length && !img.width()) {
		img.on("load", function() {
			container.trigger("keepToBottom");
		});
	}
}
