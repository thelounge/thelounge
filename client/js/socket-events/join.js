"use strict";
const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const chat = $("#chat");
const templates = require("../../views");
const sidebar = $("#sidebar, #footer");

socket.on("join", function(data) {
	var id = data.network;
	var network = sidebar.find("#network-" + id);
	network.append(
		templates.chan({
			channels: [data.chan]
		})
	);
	chat.append(
		templates.chat({
			channels: [data.chan]
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
		.click();
});
