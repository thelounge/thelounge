"use strict";

const $ = require("jquery");
const socket = require("../socket");
const chat = $("#chat");

function findCurrentNetworkChan(name) {
	name = name.toLowerCase();

	return $(".network .chan.active")
		.parent(".network")
		.find(".chan")
		.filter(function() {
			return $(this).data("title").toLowerCase() === name;
		})
		.first();
}

chat.on("click", ".user", function() {
	var name = $(this).data("name");
	var chan = findCurrentNetworkChan(name);

	if (chan.length) {
		chan.click();
	}

	socket.emit("input", {
		target: chat.data("id"),
		text: "/whois " + name
	});
});

chat.on("click", ".inline-channel", function() {
	var name = $(this).data("chan");
	var chan = findCurrentNetworkChan(name);

	if (chan.length) {
		chan.click();
	} else {
		socket.emit("input", {
			target: chat.data("id"),
			text: "/join " + name
		});
	}
});
