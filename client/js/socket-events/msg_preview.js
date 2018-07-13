"use strict";

const socket = require("../socket");
const {vueApp, findChannel} = require("../vue");

socket.on("msg:preview", function(data) {
	const {channel} = findChannel(data.chan);
	const message = channel.messages.find((m) => m.id === data.id);

	if (!message) {
		return;
	}

	const previewIndex = message.previews.findIndex((m) => m.link === data.preview.link);

	if (previewIndex > -1) {
		vueApp.$set(message.previews, previewIndex, data.preview);
	}
});
