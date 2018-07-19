"use strict";

const $ = require("jquery");
const socket = require("../socket");

socket.on("sync_sort", function(data) {
	const type = data.type;
	const order = data.order;
	const container = $(".networks");
	const network = container.find(`.network[data-uuid="${data.target}"]`);

	if (type === "networks") {
		$.each(order, function(index, value) {
			const position = $(container.children(".network")[index]);

			if (Number(position.attr("data-id")) === value) { // Network in correct place
				return true; // No point in continuing
			}

			network.insertBefore(position);
		});
	} else if (type === "channels") {
		$.each(order, function(index, value) {
			if (index === 0) { // Shouldn't attempt to move lobby
				return true; // same as `continue` -> skip to next item
			}

			const position = $(network.children(".chan")[index]); // Target channel at position

			if (Number(position.attr("data-id")) === value) { // Channel in correct place
				return true; // No point in continuing
			}

			const channel = network.find(".chan[data-id=" + value + "]"); // Channel at position

			channel.insertBefore(position);
		});
	}
});
