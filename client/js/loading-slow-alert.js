/* eslint strict: 0 */
"use strict";

/*
 * This is a separate file for two reasons:
 * 1. CSP policy does not allow inline javascript
 * 2. It has to be a small javascript executed before all other scripts,
 *    so that the timeout can be triggered while slow JS is loading
 */

setTimeout(function() {
	var element = document.getElementById("loading-slow");

	if (element) {
		element.style.display = "block";
	}
}, 5000);

document.getElementById("loading-slow-reload").addEventListener("click", function() {
	location.reload();
});

window.g_LoungeErrorHandler = function LoungeErrorHandler(error) {
	var title = document.getElementById("loading-title");
	title.textContent = "An error has occured";

	title = document.getElementById("loading-page-message");
	title.textContent = "An error has occured that prevented the client from loading correctly.";

	var summary = document.createElement("summary");
	summary.textContent = "More details";

	if (error instanceof ErrorEvent) {
		error = error.message + "\n\n" + error.stack + "\n\nView developer tools console for more information and a better stacktrace.";
	}

	var data = document.createElement("pre");
	data.contentEditable = true;
	data.textContent = error;

	var details = document.createElement("details");
	details.appendChild(summary);
	details.appendChild(data);
	title.parentNode.insertBefore(details, title.nextSibling);
};

window.addEventListener("error", window.g_LoungeErrorHandler);
