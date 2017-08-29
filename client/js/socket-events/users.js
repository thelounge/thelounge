"use strict";

const $ = require("jquery");
const socket = require("../socket");
const chat = $("#chat");

socket.on("users", function(data) {
	const chan = chat.find("#chan-" + data.chan);

	if (chan.hasClass("active")) {
		socket.emit("names", {
			target: data.chan
		});
	} else {
		chan.data("needsNamesRefresh", true);
	}
});
