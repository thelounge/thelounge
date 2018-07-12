"use strict";

const $ = require("jquery");
const debounce = require("lodash/debounce");
const Mousetrap = require("mousetrap");
const templates = require("../views");

const {togglePreviewMoreButtonsIfNeeded} = require("./utils");

// On resize, previews in the current channel that are expanded need to compute
// their "More" button. Debounced handler to avoid performance cost.
$(window).on("resize", debounce(togglePreviewMoreButtonsIfNeeded, 150));

/* Image viewer */

const imageViewer = $("#image-viewer");

$("#windows").on("click", ".toggle-thumbnail", function(event, data = {}) {
	const link = $(this);

	// Passing `data`, specifically `data.pushState`, to not add the action to the
	// history state if back or forward buttons were pressed.
	openImageViewer(link, data);

	// Prevent the link to open a new page since we're opening the image viewer,
	// but keep it a link to allow for Ctrl/Cmd+click.
	// By binding this event on #chat we prevent input gaining focus after clicking.
	return false;
});

imageViewer.on("click", function(event, data = {}) {
	// Passing `data`, specifically `data.pushState`, to not add the action to the
	// history state if back or forward buttons were pressed.
	closeImageViewer(data);
});

Mousetrap.bind("esc", () => closeImageViewer());

Mousetrap.bind(["left", "right"], (e, key) => {
	if (imageViewer.hasClass("opened")) {
		const direction = key === "left" ? "previous" : "next";
		imageViewer.find(`.${direction}-image-btn`).trigger("click");
	}
});

function openImageViewer(link, {pushState = true} = {}) {
	$(".previous-image").removeClass("previous-image");
	$(".next-image").removeClass("next-image");

	// The next two blocks figure out what are the previous/next images. We first
	// look within the same message, as there can be multiple thumbnails per
	// message, and if not, we look at previous/next messages and take the
	// last/first thumbnail available.
	// Only expanded thumbnails are being cycled through.

	// Previous image
	let previousImage = link.closest(".preview").prev(".preview")
		.find(".toggle-content.show .toggle-thumbnail").last();

	if (!previousImage.length) {
		previousImage = link.closest(".msg").prevAll()
			.find(".toggle-content.show .toggle-thumbnail").last();
	}

	previousImage.addClass("previous-image");

	// Next image
	let nextImage = link.closest(".preview").next(".preview")
		.find(".toggle-content.show .toggle-thumbnail").first();

	if (!nextImage.length) {
		nextImage = link.closest(".msg").nextAll()
			.find(".toggle-content.show .toggle-thumbnail").first();
	}

	nextImage.addClass("next-image");

	imageViewer.html(templates.image_viewer({
		image: link.find("img").prop("src"),
		link: link.prop("href"),
		type: link.parent().hasClass("toggle-type-link") ? "link" : "image",
		hasPreviousImage: previousImage.length > 0,
		hasNextImage: nextImage.length > 0,
	}));

	// Turn off transitionend listener before opening the viewer,
	// which caused image viewer to become empty in rare cases
	imageViewer
		.off("transitionend")
		.addClass("opened");

	// History management
	if (pushState) {
		let clickTarget = "";

		// Images can be in a message (channel URL previews) or not (window URL
		// preview, e.g. changelog). This is sub-optimal and needs improvement to
		// make image preview more generic and not specific for channel previews.
		if (link.closest(".msg").length > 0) {
			clickTarget = `#${link.closest(".msg").prop("id")} `;
		}

		clickTarget += `a.toggle-thumbnail[href="${link.prop("href")}"] img`;
		history.pushState({clickTarget}, null, null);
	}
}

imageViewer.on("click", ".previous-image-btn", function() {
	$(".previous-image").trigger("click");
	return false;
});

imageViewer.on("click", ".next-image-btn", function() {
	$(".next-image").trigger("click");
	return false;
});

function closeImageViewer({pushState = true} = {}) {
	imageViewer
		.removeClass("opened")
		.one("transitionend", function() {
			imageViewer.empty();
		});

	// History management
	if (pushState) {
		const clickTarget =
			"#sidebar " +
			`.chan[data-id="${$("#sidebar .chan.active").data("id")}"]`;
		history.pushState({clickTarget}, null, null);
	}
}
