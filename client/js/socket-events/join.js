"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const chat = $("#chat");
const templates = require("../../views");
const sidebar = $("#sidebar");

socket.on("join", function(data) {
	const id = data.network;
	const network = sidebar.find(`#network-${id}`);
	const channels = network.children();
	const position = $(channels[data.index || channels.length - 1]); // Put channel in correct position, or the end if we don't have one
	const sidebarEntry = templates.chan({
		channels: [data.chan],
	});
	$(sidebarEntry).insertAfter(position);
	chat.append(
		templates.chat({
			channels: [data.chan],
		})
	);
	render.renderChannel(data.chan);

	// Queries do not automatically focus, unless the user did a whois
	if (data.chan.type === "query" && !data.shouldOpen) {
		return;
	}

	sidebar.find(".chan")
		.sort(function(a, b) {
			return $(a).data("id") - $(b).data("id");
		})
		.last()
		.trigger("click");
});
