"use strict";

const $ = require("jquery");
const socket = require("../socket");
const sidebar = $("#sidebar");

socket.on("part", function(data) {
	const chanMenuItem = sidebar.find(".chan[data-id='" + data.chan + "']");

	// When parting from the active channel/query, jump to the network's lobby
	if (chanMenuItem.hasClass("active")) {
		chanMenuItem.parent(".network").find(".lobby").click();
	}

	chanMenuItem.remove();
	$("#chan-" + data.chan).remove();
});
