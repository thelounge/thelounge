"use strict";

import Vue from "vue";

import socket from "../socket";
import store from "../store";

socket.on("msg:preview", function (data) {
	const {channel} = store.getters.findChannel(data.chan);
	const message = channel.messages.find((m) => m.id === data.id);

	if (!message) {
		return;
	}

	const previewIndex = message.previews.findIndex((m) => m.link === data.preview.link);

	if (previewIndex > -1) {
		Vue.set(message.previews, previewIndex, data.preview);
	}
});
