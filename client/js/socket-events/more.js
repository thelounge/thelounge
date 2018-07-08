"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const condensed = require("../condensed");
const chat = $("#chat");
const {Vue, vueApp, findChannel} = require("../vue");

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

	const channel = findChannel(data.chan);

	if (!channel) {
		return;
	}

	channel.channel.messages.unshift(...data.messages);

	Vue.nextTick(() => {
		// restore scroll position
		const position = chan.height() - heightOld;
		scrollable.finish().scrollTop(position);
	});

	if (data.messages.length !== 100) {
		scrollable.find(".show-more").removeClass("show");
	}

	// Swap button text back from its alternative label
	const showMoreBtn = scrollable.find(".show-more button");
	swapText(showMoreBtn);
	showMoreBtn.prop("disabled", false);

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

chat.on("click", ".show-more button", function() {
	const self = $(this);
	const lastMessage = self.closest(".chat").find(".msg:not(.condensed)").first();
	let lastMessageId = -1;

	if (lastMessage.length > 0) {
		lastMessageId = parseInt(lastMessage.prop("id").replace("msg-", ""), 10);
	}

	// Swap button text with its alternative label
	swapText(self);
	self.prop("disabled", true);

	socket.emit("more", {
		target: self.data("id"),
		lastId: lastMessageId,
	});
});

// Given a button, swap its text with the content of `data-alt-text`
function swapText(btn) {
	const altText = btn.data("alt-text");
	btn.data("alt-text", btn.text()).text(altText);
}
