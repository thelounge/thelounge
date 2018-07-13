/* eslint strict: 0, no-var: 0 */
"use strict";

/*
 * This is a separate file for two reasons:
 * 1. CSP policy does not allow inline javascript
 * 2. It has to be a small javascript executed before all other scripts,
 *    so that the timeout can be triggered while slow JS is loading
 */

(function() {
	const msg = document.getElementById("loading-page-message");
	
	if (msg) {
		msg.textContent = "Loading the app…";

		document.getElementById("loading-reload").addEventListener("click", function() {
			location.reload(true);
		});
	}

	var displayReload = function displayReload() {
		var loadingReload = document.getElementById("loading-reload");

		if (loadingReload) {
			loadingReload.style.visibility = "visible";
		}
	};

	var loadingSlowTimeout = setTimeout(function() {
		var loadingSlow = document.getElementById("loading-slow");

		// The parent element, #loading, is being removed when the app is loaded.
		// Since the timer is not cancelled, `loadingSlow` can be not found after
		// 5s. Wrap everything in this block to make sure nothing happens if the
		// element does not exist (i.e. page has loaded).
		if (loadingSlow) {
			loadingSlow.style.visibility = "visible";
			displayReload();
		}
	}, 5000);

	window.g_LoungeErrorHandler = function LoungeErrorHandler(e) {
		var message = document.getElementById("loading-page-message");
		message.textContent = "An error has occurred that prevented the client from loading correctly.";

		var summary = document.createElement("summary");
		summary.textContent = "More details";

		var data = document.createElement("pre");
		data.textContent = e.message; // e is an ErrorEvent

		var info = document.createElement("p");
		info.textContent = "Open the developer tools of your browser for more information.";

		var details = document.createElement("details");
		details.appendChild(summary);
		details.appendChild(data);
		details.appendChild(info);
		message.parentNode.insertBefore(details, message.nextSibling);

		window.clearTimeout(loadingSlowTimeout);
		displayReload();
	};

	window.addEventListener("error", window.g_LoungeErrorHandler);

	// Trigger early service worker registration
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("service-worker.js");
	}
})();
