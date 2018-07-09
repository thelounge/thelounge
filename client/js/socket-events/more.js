"use strict";

const $ = require("jquery");
const socket = require("../socket");
const {vueApp, findChannel} = require("../vue");

socket.on("more", function(data) {
	let chan = $("#chat #chan-" + data.chan);
	chan = chan.find(".messages");

	// get the scrollable wrapper around messages
	const scrollable = chan.closest(".chat");
	const heightOld = chan.height() - scrollable.scrollTop();

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
});
