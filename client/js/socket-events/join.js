"use strict";

const $ = require("jquery");
const socket = require("../socket");
const sidebar = $("#sidebar");
const {vueApp, initChannel} = require("../vue");

socket.on("join", function(data) {
	initChannel(data.chan);

	vueApp.networks.find((n) => n.uuid === data.network)
		.channels.splice(data.index || -1, 0, data.chan);

	// Queries do not automatically focus, unless the user did a whois
	if (data.chan.type === "query" && !data.shouldOpen) {
		return;
	}

	vueApp.$nextTick(() => {
		sidebar.find(".chan")
			.sort(function(a, b) {
				return $(a).data("id") - $(b).data("id");
			})
			.last()
			.trigger("click");
	});
});
