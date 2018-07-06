"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const chat = $("#chat");
const templates = require("../../views");
const sidebar = $("#sidebar");
const {Vue, vueApp} = require("../vue");

socket.on("join", function(data) {
	vueApp.networks.find((n) => n.uuid === data.network)
		.channels.splice(data.index || -1, 0, data.chan);

	chat.append(
		templates.chat({
			channels: [data.chan],
		})
	);

	Vue.nextTick(() => render.renderChannel(data.chan));

	// Queries do not automatically focus, unless the user did a whois
	if (data.chan.type === "query" && !data.shouldOpen) {
		return;
	}

	Vue.nextTick(() => {
		sidebar.find(".chan")
			.sort(function(a, b) {
				return $(a).data("id") - $(b).data("id");
			})
			.last()
			.trigger("click");
	});
});
