"use strict";

const $ = require("jquery");
const socket = require("../socket");
const utils = require("../utils");
const sidebar = $("#sidebar");

socket.on("nick", function(data) {
	const id = data.network;
	const nick = data.nick;
	const network = sidebar.find("#network-" + id).data("nick", nick);
	if (network.find(".active").length) {
		utils.setNick(nick);
	}
});
