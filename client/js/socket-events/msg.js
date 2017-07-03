"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const chat = $("#chat");
const templates = require("../../views");

socket.on("msg", function(data) {
	const msg = render.buildChatMessage(data);
	const target = "#chan-" + data.chan;
	const container = chat.find(target + " .messages");

	if (data.msg.type === "channel_list" || data.msg.type === "ban_list") {
		$(container).empty();
	}

	// Check if date changed
	const prevMsg = $(container.find(".msg")).last();
	const prevMsgTime = new Date(prevMsg.attr("data-time"));
	const msgTime = new Date(msg.attr("data-time"));

	// It's the first message in a channel/query
	if (prevMsg.length === 0) {
		container.append(templates.date_marker({msgDate: msgTime}));
	}

	if (prevMsgTime.toDateString() !== msgTime.toDateString()) {
		prevMsg.after(templates.date_marker({msgDate: msgTime}));
	}

	// Add message to the container
	container
		.append(msg)
		.trigger("msg", [
			target,
			data
		])
		.trigger("keepToBottom");

	var lastVisible = container.find("div:visible").last();
	if (data.msg.self
		|| lastVisible.hasClass("unread-marker")
		|| (lastVisible.hasClass("date-marker")
		&& lastVisible.prev().hasClass("unread-marker"))) {
		container
			.find(".unread-marker")
			.appendTo(container);
	}
});
