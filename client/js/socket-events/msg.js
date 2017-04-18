"use strict";
const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const chat = $("#chat");
const templates = require("../../views");

socket.on("msg", function(data) {
	var msg = render.buildChatMessage(data);
	var target = "#chan-" + data.chan;
	var container = chat.find(target + " .messages");

			// Check if date changed
	var prevMsg = $(container.find(".msg")).last();
	var prevMsgTime = new Date(prevMsg.attr("data-time"));
	var msgTime = new Date(msg.attr("data-time"));

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
		]);

	if (data.msg.self) {
		container
			.find(".unread-marker")
			.appendTo(container);
	}
});
