"use strict";

// vendor libraries
const $ = require("jquery");

// our libraries
const socket = require("./socket");

window.vueMounted = () => {
	require("./socket-events");
	require("./contextMenuFactory");
	require("./webpush");
	require("./keybinds");

	window.addEventListener("popstate", (e) => {
		const {state} = e;

		if (!state) {
			return;
		}

		let {clickTarget} = state;

		if (clickTarget) {
			// This will be true when click target corresponds to opening a thumbnail,
			// browsing to the previous/next thumbnail, or closing the image viewer.
			const imageViewerRelated = clickTarget.includes(".toggle-thumbnail");

			// If the click target is not related to the image viewer but the viewer
			// is currently opened, we need to close it.
			if (!imageViewerRelated && $("#image-viewer").hasClass("opened")) {
				clickTarget += ", #image-viewer";
			}

			// Emit the click to the target, while making sure it is not going to be
			// added to the state again.
			$(clickTarget).trigger("click", {
				pushState: false,
			});
		}
	});

	// Only start opening socket.io connection after all events have been registered
	socket.open();
};
