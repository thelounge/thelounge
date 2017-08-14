"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const chat = $("#chat");
const templates = require("../../views");

socket.on("more", function(data) {
	const documentFragment = render.buildChannelMessages(data);
	const chan = chat
		.find("#chan-" + data.chan)
		.find(".messages");

	// get the scrollable wrapper around messages
	const scrollable = chan.closest(".chat");
	const heightOld = chan.height();

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
	chan.prepend(documentFragment).end();

	// restore scroll position
	const position = chan.height() - heightOld;
	scrollable.scrollTop(position);

	if (data.messages.length !== 100) {
		scrollable.find(".show-more").removeClass("show");
	}

	// Date change detect
	// Have to use data instaid of the documentFragment because it's being weird
	let lastDate;
	$(data.messages).each(function() {
		const msgData = this;
		const msgDate = new Date(msgData.time);
		const msg = $(chat.find("#chan-" + data.chan + " .messages #msg-" + msgData.id));

		// Top-most message in a channel
		if (!lastDate) {
			lastDate = msgDate;
			msg.before(templates.date_marker({msgDate: msgDate}));
		}

		if (lastDate.toDateString() !== msgDate.toDateString()) {
			var parent = msg.parent();
			if (parent.hasClass("condensed")) {
				msg.insertAfter(parent);
			}
			msg.before(templates.date_marker({msgDate: msgDate}));
		}

		lastDate = msgDate;
	});

	scrollable.find(".show-more-button")
		.text("Show older messages")
		.prop("disabled", false);
});
