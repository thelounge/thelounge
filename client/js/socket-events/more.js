"use strict";

const $ = require("jquery");
const socket = require("../socket");
const condensed = require("../condensed");
const {vueApp, findChannel} = require("../vue");

socket.on("more", function(data) {
	let chan = $("#chat #chan-" + data.chan);
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

	const channel = findChannel(data.chan);

	if (!channel) {
		return;
	}

	channel.channel.messages.unshift(...data.messages);
	channel.channel.historyLoading = false;

	vueApp.$nextTick(() => {
		// restore scroll position
		const position = chan.height() - heightOld;
		scrollable.finish().scrollTop(position);
	});

	if (data.messages.length !== 100) {
		scrollable.find(".show-more").removeClass("show");
	}

	return;

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
});
