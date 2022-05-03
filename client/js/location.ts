"use strict";

// This is a thin wrapper around `window.location`, in order to contain the
// side-effects. Do not add logic to it as it cannot be tested, only mocked.
export default {
	reload() {
		window.location.reload();
	},
};
