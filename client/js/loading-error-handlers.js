/* eslint strict: 0 */
"use strict";

/*
 * This is a separate file for two reasons:
 * 1. CSP policy does not allow inline javascript
 * 2. It has to be a small javascript executed before all other scripts,
 *    so that the timeout can be triggered while slow JS is loading
 */

(function() {
	const msg = document.getElementById("loading-page-message");
	msg.textContent = "Loading the app…";

	document
		.getElementById("loading-reload")
		.addEventListener("click", () => location.reload(true));

	const displayReload = () => {
		const loadingReload = document.getElementById("loading-reload");

		if (loadingReload) {
			loadingReload.style.visibility = "visible";
		}
	};

	const loadingSlowTimeout = setTimeout(() => {
		const loadingSlow = document.getElementById("loading-slow");
		loadingSlow.style.visibility = "visible";
		displayReload();
	}, 5000);

	const errorHandler = (e) => {
		msg.textContent = "An error has occurred that prevented the client from loading correctly.";

		const summary = document.createElement("summary");
		summary.textContent = "More details";

		const data = document.createElement("pre");
		data.textContent = e.message; // e is an ErrorEvent

		const info = document.createElement("p");
		info.textContent = "Open the developer tools of your browser for more information.";

		const details = document.createElement("details");
		details.appendChild(summary);
		details.appendChild(data);
		details.appendChild(info);
		msg.parentNode.insertBefore(details, msg.nextSibling);

		window.clearTimeout(loadingSlowTimeout);
		displayReload();
	};

	window.addEventListener("error", errorHandler);

	window.g_TheLoungeRemoveLoading = () => {
		delete window.g_TheLoungeRemoveLoading;
		window.clearTimeout(loadingSlowTimeout);
		window.removeEventListener("error", errorHandler);
		document.getElementById("loading").remove();
	};

	// Trigger early service worker registration
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("service-worker.js");

		// Handler for messages coming from the service worker
		const messageHandler = (event) => {
			if (event.data.type === "fetch-error") {
				errorHandler({
					message: `Service worker failed to fetch an url: ${event.data.message}`,
				});

				// Display only one fetch error
				navigator.serviceWorker.removeEventListener("message", messageHandler);
			}
		};

		navigator.serviceWorker.addEventListener("message", messageHandler);
	}
})();
