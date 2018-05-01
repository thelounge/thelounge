"use strict";

const $ = require("jquery");
const socket = require("../socket");

socket.on("channel:modes", function(data) {
	const sidebar = $("#sidebar");
	const network = sidebar.find("#network-" + data.network);
	const channel = network.find("[aria-label=\"" + data.channel + "\"]");
	channel.data("modes", data.modes);
});
