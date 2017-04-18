"use strict";

const $ = require("jquery");
const slideoutMenu = require("./libs/slideout");
const socket = require("./socket");
const utils = require("./utils");
const chat = $("#chat");
const sidebar = $("#sidebar, #footer");
const viewport = $("#viewport");
const sidebarSlide = slideoutMenu(viewport[0], sidebar[0]);
const input = $("#input");

$("#main").on("click", function(e) {
	if ($(e.target).is(".lt")) {
		sidebarSlide.toggle(!sidebarSlide.isOpen());
	} else if (sidebarSlide.isOpen()) {
		sidebarSlide.toggle(false);
	}
});

sidebar.on("click", ".chan, button", function() {
	var self = $(this);
	var target = self.data("target");
	if (!target) {
		return;
	}

	chat.data(
		"id",
		self.data("id")
	);
	socket.emit(
		"open",
		self.data("id")
	);

	sidebar.find(".active").removeClass("active");
	self.addClass("active")
		.find(".badge")
		.removeClass("highlight")
		.empty();

	if (sidebar.find(".highlight").length === 0) {
		utils.toggleNotificationMarkers(false);
	}

	sidebarSlide.toggle(false);

	var lastActive = $("#windows > .active");

	lastActive
		.removeClass("active")
		.find(".chat")
		.unsticky();

	var lastActiveChan = lastActive
		.find(".chan.active")
		.removeClass("active");

	lastActiveChan
		.find(".unread-marker")
		.appendTo(lastActiveChan.find(".messages"));

	var chan = $(target)
		.addClass("active")
		.trigger("show");

	var title = "The Lounge";
	if (chan.data("title")) {
		title = chan.data("title") + " — " + title;
	}
	document.title = title;

	var placeholder = "";
	if (chan.data("type") === "channel" || chan.data("type") === "query") {
		placeholder = `Write to ${chan.data("title")}`;
	}
	input.attr("placeholder", placeholder);

	if (self.hasClass("chan")) {
		$("#chat-container").addClass("active");
		utils.setNick(self.closest(".network").data("nick"));
	}

	var chanChat = chan.find(".chat");
	if (chanChat.length > 0) {
		chanChat.sticky();
	}

	if (chan.data("needsNamesRefresh") === true) {
		chan.data("needsNamesRefresh", false);
		socket.emit("names", {target: self.data("id")});
	}

	focus();
});
