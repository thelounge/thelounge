import socket from "../socket";
import {store} from "../store";
import {flushDrafts, receiveDraft} from "../drafts";

socket.on("draft", function (data) {
	const netChan = store.getters.findChannel(data.target);

	if (netChan) {
		receiveDraft(netChan.network, netChan.channel, data.draft);
	}
});

// Mobile browsers may suspend or discard a page as soon as it is hidden
window.addEventListener("pagehide", flushDrafts);
document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "hidden") {
		flushDrafts();
	}
});
