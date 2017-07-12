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

/* Image viewer */

// FIXME Remove #input focus when this is open
// See https://github.com/thelounge/lounge/issues/1342
$("#viewport").on("click", ".toggle-thumbnail", function() {
	const link = $(this);

	openImageViewer(link);

	// Prevent the link to open a new page since we're opening the image viewer,
	// but keep it a link to allow for Ctrl/Cmd+click
	return false;
});

$("#image-viewer").on("click", function() {
	closeImageViewer();
});

$(document).keydown(function(e) {
	switch (e.keyCode ? e.keyCode : e.which) {
	case 27: // Escape
		closeImageViewer();
		break;
	}
});

function openImageViewer(link) {
	$("#image-viewer").html(templates.image_viewer({
		image: link.find("img").attr("src"),
		link: link.attr("href"),
		type: link.parent().hasClass("toggle-type-image") ? "image" : "link"
	}));

	$(document.body).addClass("image-viewer-opened");
}

function closeImageViewer() {
	$(document.body)
		.removeClass("image-viewer-opened")
		.one("transitionend", function() {
			$("#image-viewer").empty();
		});
}
