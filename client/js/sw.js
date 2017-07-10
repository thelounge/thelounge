"use strict";

function registerServiceWorker() {
	if (navigator.serviceWorker) {
		navigator.serviceWorker.register("./js/libs/sw.js")
			.catch(function(err) {
				console.error("Unable to register service worker.", err);
			});
	}
}

module.exports = {registerServiceWorker};
