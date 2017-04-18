"use strict";
const $ = require("jquery");
const socket = require("../socket");
const options = require("../options");

socket.on("sync_sort", function(data) {
	// Syncs the order of channels or networks when they are reordered
	if (options.ignoreSortSync) {
		options.ignoreSortSync = false;
		return; // Ignore syncing because we 'caused' it
	}

	var type = data.type;
	var order = data.order;

	if (type === "networks") {
		var container = $(".networks");

		$.each(order, function(index, value) {
			var position = $(container.children()[index]);

			if (position.data("id") === value) { // Network in correct place
				return true; // No point in continuing
			}

			var network = container.find("#network-" + value);

			$(network).insertBefore(position);
		});
	} else if (type === "channels") {
		var network = $("#network-" + data.target);

		$.each(order, function(index, value) {
			if (index === 0) { // Shouldn't attempt to move lobby
				return true; // same as `continue` -> skip to next item
			}

			var position = $(network.children()[index]); // Target channel at position

			if (position.data("id") === value) { // Channel in correct place
				return true; // No point in continuing
			}

			var channel = network.find(".chan[data-id=" + value + "]"); // Channel at position

			$(channel).insertBefore(position);
		});
	}
});
