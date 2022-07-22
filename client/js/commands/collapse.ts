import socket from "../socket";
import {store} from "../store";

function input() {
	if (!store.state.activeChannel) {
		return;
	}

	const messageIds: number[] = [];

	for (const message of store.state.activeChannel.channel.messages) {
		let toggled = false;

		for (const preview of message.previews) {
			if (preview.shown) {
				preview.shown = false;
				toggled = true;
			}
		}

		if (toggled) {
			messageIds.push(message.id);
		}
	}

	// Tell the server we're toggling so it remembers at page reload
	if (!document.body.classList.contains("public") && messageIds.length > 0) {
		socket.emit("msg:preview:toggle", {
			target: store.state.activeChannel?.channel.id,
			messageIds: messageIds,
			shown: false,
		});
	}

	return true;
}

export default {input};
