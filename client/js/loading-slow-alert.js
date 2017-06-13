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
