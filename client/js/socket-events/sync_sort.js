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

	const type = data.type;
	const order = data.order;

	if (type === "networks") {
		const container = $(".networks");

		$.each(order, function(index, value) {
			const position = $(container.children()[index]);

			if (position.data("id") === value) { // Network in correct place
				return true; // No point in continuing
			}

			const network = container.find("#network-" + value);

			$(network).insertBefore(position);
		});
	} else if (type === "channels") {
		const network = $("#network-" + data.target);

		$.each(order, function(index, value) {
			if (index === 0) { // Shouldn't attempt to move lobby
				return true; // same as `continue` -> skip to next item
			}

			const position = $(network.children()[index]); // Target channel at position

			if (position.data("id") === value) { // Channel in correct place
				return true; // No point in continuing
			}

			const channel = network.find(".chan[data-id=" + value + "]"); // Channel at position

			$(channel).insertBefore(position);
		});
	}
});
