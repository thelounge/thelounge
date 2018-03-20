"use strict";

module.exports = {
	set(key, value) {
		try {
			window.localStorage.setItem(key, value);
		} catch (e) {
			// Do nothing. If we end up here, web storage quota exceeded, or user is
			// in Safari's private browsing where localStorage's setItem is not
			// available. See http://stackoverflow.com/q/14555347/1935861.
		}
	},
	get(key) {
		return window.localStorage.getItem(key);
	},
	remove(key) {
		window.localStorage.removeItem(key);
	},
	clear() {
		window.localStorage.clear();
	},
};
