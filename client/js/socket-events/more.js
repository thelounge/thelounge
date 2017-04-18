"use strict";
const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const chat = $("#chat");
const templates = require("../../views");

socket.on("more", function(data) {
	var documentFragment = render.buildChannelMessages(data.chan, data.messages);
	var chan = chat
		.find("#chan-" + data.chan)
		.find(".messages");

	// Remove the date-change marker we put at the top, because it may
	// not actually be a date change now
	var children = $(chan).children();
	if (children.eq(0).hasClass("date-marker")) { // Check top most child
		children.eq(0).remove();
	} else if (children.eq(0).hasClass("unread-marker") && children.eq(1).hasClass("date-marker")) {
		// Otherwise the date-marker would get 'stuck' because of the new-message marker
		children.eq(1).remove();
	}

	// get the scrollable wrapper around messages
	var scrollable = chan.closest(".chat");
	var heightOld = chan.height();
	chan.prepend(documentFragment).end();

	// restore scroll position
	var position = chan.height() - heightOld;
	scrollable.scrollTop(position);

	if (data.messages.length !== 100) {
		scrollable.find(".show-more").removeClass("show");
	}

	// Date change detect
	// Have to use data instaid of the documentFragment because it's being weird
	var lastDate;
	$(data.messages).each(function() {
		var msgData = this;
		var msgDate = new Date(msgData.time);
		var msg = $(chat.find("#chan-" + data.chan + " .messages #msg-" + msgData.id));

		// Top-most message in a channel
		if (!lastDate) {
			lastDate = msgDate;
			msg.before(templates.date_marker({msgDate: msgDate}));
		}

		if (lastDate.toDateString() !== msgDate.toDateString()) {
			msg.before(templates.date_marker({msgDate: msgDate}));
		}

		lastDate = msgDate;
	});
});
