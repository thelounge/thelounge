"use strict";

const $ = require("jquery");
const socket = require("../socket");

socket.on("nick", function(data) {
	const id = data.network;
	const nick = data.nick;
	const network = $("#sidebar").find("#network-" + id).data("nick", nick);

	if (network.find(".active").length) {
		$("#nick").text(nick);
	}
});
