"use strict";
import socket from "../socket";
import store from "../store";

function input(args) {
	if (args.length === 0) {
		const {channel} = store.state.activeChannel;

		socket.emit("input", {
			target: channel.id,
			text: `/favorite ${channel.name}`,
		});
	} else {
		for (const arg of args) {
			for (const network of store.state.networks) {
				const channel = network.channels.find((c) => c.name === arg);

				if (!channel) {
					continue;
				}

				socket.emit("input", {
					target: channel.id,
					text: `/favorite ${channel.name}`,
				});
			}
		}
	}

	return true;
}

export default {input};
