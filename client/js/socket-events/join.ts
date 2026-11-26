import socket from "../socket";
import {store} from "../store";
import {switchToChannel} from "../router";
import {ClientChan} from "../types";
import {toClientChan} from "../chan";
import {restoreDraft} from "../drafts";

socket.on("join", function (data) {
	const network = store.getters.findNetwork(data.network);

	if (!network) {
		return;
	}

	const clientChan: ClientChan = toClientChan(data.chan);
	network.channels.splice(data.index || -1, 0, clientChan);

	const added = store.getters.findChannel(data.chan.id);

	if (added) {
		restoreDraft(added.network, added.channel, data.chan.draft);
	}

	// Queries do not automatically focus, unless the user did a whois
	if (data.chan.type === "query" && !data.shouldOpen) {
		return;
	}

	const chan = store.getters.findChannel(data.chan.id);

	if (chan) {
		switchToChannel(chan.channel);
	} else {
		// eslint-disable-next-line no-console
		console.error("Could not find channel", data.chan.id);
	}
});
