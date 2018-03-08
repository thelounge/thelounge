"use strict";

const $ = require("jquery");
const chat = $("#chat");
const socket = require("../socket");
const sidebar = $("#sidebar");

socket.on("quit", function(data) {
	const id = data.network;
	const network = sidebar.find(`#network-${id}`);

	network.children(".chan").each(function() {
		// this = child
		chat.find($(this).data("target")).remove();
	});

	network.remove();

	const chan = sidebar.find(".chan")
		.eq(0)
		.trigger("click");

	if (chan.length === 0) {
		sidebar.find(".empty").show();
	}
});
