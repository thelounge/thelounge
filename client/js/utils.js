"use strict";

const $ = require("jquery");
const chat = $("#chat");
const input = $("#input");

module.exports = {
	clear,
	confirmExit,
	forceFocus,
	move,
	resetHeight,
	setNick,
	toggleNickEditor,
	toggleNotificationMarkers
};

function resetHeight(element) {
	element.style.height = element.style.minHeight;
}

// Triggering click event opens the virtual keyboard on mobile
// This can only be called from another interactive event (e.g. button click)
function forceFocus() {
	input.trigger("click").focus();
}

function clear() {
	chat.find(".active")
		.find(".show-more").addClass("show").end()
		.find(".messages .msg, .date-marker-container").remove();
}

function toggleNickEditor(toggle) {
	$("#nick").toggleClass("editable", toggle);
	$("#nick-value").attr("contenteditable", toggle);
}

function setNick(nick) {
	// Closes the nick editor when canceling, changing channel, or when a nick
	// is set in a different tab / browser / device.
	toggleNickEditor(false);

	$("#nick-value").text(nick);
}

const favicon = $("#favicon");

function toggleNotificationMarkers(newState) {
	// Toggles the favicon to red when there are unread notifications
	if (favicon.data("toggled") !== newState) {
		var old = favicon.attr("href");
		favicon.attr("href", favicon.data("other"));
		favicon.data("other", old);
		favicon.data("toggled", newState);
	}

	// Toggles a dot on the menu icon when there are unread notifications
	$("#viewport .lt").toggleClass("notified", newState);
}

function confirmExit() {
	if ($("body").hasClass("public")) {
		window.onbeforeunload = function() {
			return "Are you sure you want to navigate away from this page?";
		};
	}
}

function move(array, old_index, new_index) {
	if (new_index >= array.length) {
		let k = new_index - array.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}
	array.splice(new_index, 0, array.splice(old_index, 1)[0]);
	return array;
}
