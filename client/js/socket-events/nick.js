"use strict";
const $ = require("jquery");
const socket = require("../socket");
const utils = require("../utils");
const sidebar = $("#sidebar, #footer");

socket.on("nick", function(data) {
	var id = data.network;
	var nick = data.nick;
	var network = sidebar.find("#network-" + id).data("nick", nick);
	if (network.find(".active").length) {
		utils.setNick(nick);
	}
});
