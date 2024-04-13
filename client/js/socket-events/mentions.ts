import socket from "../socket";
import {store} from "../store";
import {ClientMention} from "../types";
import {SharedMention} from "../../../shared/types/mention";

socket.on("mentions:list", function (data) {
	store.commit("mentions", data.map(sharedToClientMention));
});

function sharedToClientMention(shared: SharedMention): ClientMention {
	const mention: ClientMention = {
		...shared,
		localetime: "", // TODO: can't be right
		channel: null,
	};
	return mention;
}
