"use strict";

const $ = require("jquery");
const debounce = require("lodash/debounce");
const Mousetrap = require("mousetrap");

const options = require("./options");
const socket = require("./socket");
const templates = require("../views");
const chat = $("#chat");

const {togglePreviewMoreButtonsIfNeeded} = require("./utils");

module.exports = renderPreview;

function renderPreview(preview, msg) {
	if (preview.type === "loading") {
		return;
	}

	preview.shown = preview.shown && options.shouldOpenMessagePreview(preview.type);

	const template = $(templates.msg_preview({preview}));
	const image = template.find("img, video, audio").first();

	if (image.length === 0) {
		return appendPreview(preview, msg, template);
	}

	const loadEvent = image.prop("tagName") === "IMG" ? "load" : "canplay";

	// If there is an image in preview, wait for it to load before appending it to DOM
	// This is done to prevent problems keeping scroll to the bottom while images load
	image.on(`${loadEvent}.preview`, () => {
		image.off(".preview");

		appendPreview(preview, msg, template);
	});

	// If the image fails to load, remove it from DOM and still render the preview
	if (preview.type === "link") {
		image.on("abort.preview error.preview", () => {
			image.parent().remove();

			appendPreview(preview, msg, template);
		});
	}
}

function appendPreview(preview, msg, template) {
	const escapedLink = preview.link.replace(/["\\]/g, "\\$&");
	const previewContainer = msg.find(`.preview[data-url="${escapedLink}"]`);

	// This is to fix a very rare case of rendering a preview twice
	// This happens when a very large amount of messages is being sent to the client
	// and they get queued, so the `preview` object on the server has time to load before
	// it actually gets sent to the server, which makes the loaded preview sent twice,
	// once in `msg` and another in `msg:preview`
	if (!previewContainer.is(":empty")) {
		return;
	}

	const container = msg.closest(".chat");
	const channel = container.closest(".chan");
	const channelId = channel.data("id") || -1;
	const activeChannelId = chat.find(".chan.active").data("id") || -2;

	msg.find(`.text a[href="${escapedLink}"]`)
		.first()
		.after(templates.msg_preview_toggle({preview}).trim());

	previewContainer.append(template);

	const moreBtn = previewContainer.find(".more");
	const previewContent = previewContainer.find(".toggle-content");

	// Depending on the size of the preview and the text within it, show or hide a
	// "More" button that allows users to expand without having to open the link.
	// Warning: Make sure to call this only on active channel, link previews only,
	// expanded only.
	const showMoreIfNeeded = () => {
		const isVisible = moreBtn.is(":visible");
		const shouldShow = previewContent[0].offsetWidth >= previewContainer[0].offsetWidth;

		if (!isVisible && shouldShow) {
			moreBtn.show();
		} else if (isVisible && !shouldShow) {
			togglePreviewMore(moreBtn, false);
			moreBtn.hide();
		}
	};

	// "More" button only applies on text previews
	if (preview.type === "link") {
		// This event is triggered when a side menu is opened/closed, or when the
		// preview gets expanded/collapsed.
		previewContent.on("showMoreIfNeeded",
			() => window.requestAnimationFrame(showMoreIfNeeded)
		);
	}

	if (activeChannelId === channelId) {
		// If this preview is in active channel, hide "More" button if necessary
		previewContent.trigger("showMoreIfNeeded");
	}
}

// On resize, previews in the current channel that are expanded need to compute
// their "More" button. Debounced handler to avoid performance cost.
$(window).on("resize", debounce(togglePreviewMoreButtonsIfNeeded, 150));

$("#chat").on("click", ".text .toggle-button", function() {
	const self = $(this);
	const container = self.closest(".chat");
	const content = self.closest(".content")
		.find(`.preview[data-url="${self.data("url")}"] .toggle-content`);
	const bottom = container.isScrollBottom();

	self.toggleClass("opened");
	content.toggleClass("show");

	const isExpanded = content.hasClass("show");

	if (isExpanded) {
		content.trigger("showMoreIfNeeded");
	}

	// Tell the server we're toggling so it remembers at page reload
	// TODO Avoid sending many single events when using `/collapse` or `/expand`
	// See https://github.com/thelounge/thelounge/issues/1377
	socket.emit("msg:preview:toggle", {
		target: parseInt(self.closest(".chan").data("id"), 10),
		msgId: parseInt(self.closest(".msg").prop("id").replace("msg-", ""), 10),
		link: self.data("url"),
		shown: isExpanded,
	});

	// If scrollbar was at the bottom before toggling the preview, keep it at the bottom
	if (bottom) {
		container.scrollBottom();
	}
});

$("#chat").on("click", ".toggle-content .more", function() {
	togglePreviewMore($(this));
	return false;
});

function togglePreviewMore(moreBtn, state = undefined) {
	moreBtn.closest(".toggle-content").toggleClass("opened", state);
	const isExpanded = moreBtn.closest(".toggle-content").hasClass("opened");

	moreBtn.attr("aria-expanded", isExpanded);

	if (isExpanded) {
		moreBtn.attr("aria-label", moreBtn.data("opened-text"));
	} else {
		moreBtn.attr("aria-label", moreBtn.data("closed-text"));
	}
}

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
