"use strict";
const $ = require("jquery");
const sidebar = $("#sidebar, #footer");
const socket = require("./socket");
const options = require("./options");
const chat = $("#chat");
const input = $("#input");

module.exports = {
	clear,
	confirmExit,
	forceFocus,
	move,
	resetHeight,
	setNick,
	sortable,
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
		.find(".messages .msg, .date-marker").remove();
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

var favicon = $("#favicon");

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
		var k = new_index - array.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}
	array.splice(new_index, 0, array.splice(old_index, 1)[0]);
	return array;
}

function sortable() {
	sidebar.find(".networks").sortable({
		axis: "y",
		containment: "parent",
		cursor: "move",
		distance: 12,
		items: ".network",
		handle: ".lobby",
		placeholder: "network-placeholder",
		forcePlaceholderSize: true,
		tolerance: "pointer", // Use the pointer to figure out where the network is in the list

		update: function() {
			var order = [];
			sidebar.find(".network").each(function() {
				var id = $(this).data("id");
				order.push(id);
			});
			socket.emit(
				"sort", {
					type: "networks",
					order: order
				}
			);

			options.ignoreSortSync = true;
		}
	});
	sidebar.find(".network").sortable({
		axis: "y",
		containment: "parent",
		cursor: "move",
		distance: 12,
		items: ".chan:not(.lobby)",
		placeholder: "chan-placeholder",
		forcePlaceholderSize: true,
		tolerance: "pointer", // Use the pointer to figure out where the channel is in the list

		update: function(e, ui) {
			var order = [];
			var network = ui.item.parent();
			network.find(".chan").each(function() {
				var id = $(this).data("id");
				order.push(id);
			});
			socket.emit(
				"sort", {
					type: "channels",
					target: network.data("id"),
					order: order
				}
			);

			options.ignoreSortSync = true;
		}
	});
}
