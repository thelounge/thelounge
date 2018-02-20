"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const condensed = require("../condensed");
const chat = $("#chat");

socket.on("more", function(data) {
	let chan = chat.find("#chan-" + data.chan);
	const type = chan.data("type");
	chan = chan.find(".messages");

	// get the scrollable wrapper around messages
	const scrollable = chan.closest(".chat");
	const heightOld = chan.height() - scrollable.scrollTop();

	// If there are no more messages to show, just hide the button and do nothing else
	if (!data.messages.length) {
		scrollable.find(".show-more").removeClass("show");
		return;
	}

	// Remove the date-change marker we put at the top, because it may
	// not actually be a date change now
	const children = $(chan).children();

	if (children.eq(0).hasClass("date-marker-container")) { // Check top most child
		children.eq(0).remove();
	} else if (children.eq(1).hasClass("date-marker-container")) {
		// The unread-marker could be at index 0, which will cause the date-marker to become "stuck"
		children.eq(1).remove();
	} else if (children.eq(0).hasClass("condensed") && children.eq(0).children(".date-marker-container").eq(0).hasClass("date-marker-container")) {
		children.eq(0).children(".date-marker-container").eq(0).remove();
	}

	// Add the older messages
	const documentFragment = render.buildChannelMessages($(document.createDocumentFragment()), data.chan, type, data.messages);
	chan.prepend(documentFragment);

	// Move unread marker to correct spot if needed
	const unreadMarker = chan.find(".unread-marker");
	const firstUnread = unreadMarker.data("unread-id");

	if (firstUnread > 0) {
		let first = chan.find("#msg-" + firstUnread);

		if (!first.length) {
			chan.prepend(unreadMarker);
		} else {
			const parent = first.parent();

			if (parent.hasClass("condensed")) {
				first = parent;
			}

			unreadMarker.data("unread-id", 0);

			first.before(unreadMarker);
		}
	}

	// Join duplicate condensed messages together
	const condensedDuplicate = chan.find(".msg.condensed + .msg.condensed");

	if (condensedDuplicate) {
		const condensedCorrect = condensedDuplicate.prev();

		condensed.updateText(condensedCorrect, condensed.getStoredTypes(condensedDuplicate));

		condensedCorrect
			.append(condensedDuplicate.find(".msg"))
			.toggleClass("closed", condensedDuplicate.hasClass("closed"));

		condensedDuplicate.remove();
	}

	// restore scroll position
	const position = chan.height() - heightOld;
	scrollable.finish().scrollTop(position);

	// We have to do this hack due to smooth scrolling in browsers,
	// as scrollTop does not apply correctly
	if (window.requestAnimationFrame) {
		window.requestAnimationFrame(() => scrollable.scrollTop(position));
	}

	if (data.messages.length !== 100) {
		scrollable.find(".show-more").removeClass("show");
	}

	scrollable.find(".show-more-button")
		.text("Show older messages")
		.prop("disabled", false);
});

chat.on("click", ".show-more-button", function() {
	const self = $(this);
	const lastMessage = self.closest(".chat").find(".msg:not(.condensed)").first();
	let lastMessageId = -1;

	if (lastMessage.length > 0) {
		lastMessageId = parseInt(lastMessage.prop("id").replace("msg-", ""), 10);
	}

	self
		.text("Loading older messages…")
		.prop("disabled", true);

	socket.emit("more", {
		target: self.data("id"),
		lastId: lastMessageId,
	});
});
