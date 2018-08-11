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
		try {
			return window.localStorage.getItem(key);
		} catch (e) {
			console.warn("Cannot get item from localStorage");
			return null;
		}
	},
	remove(key) {
		try {
			window.localStorage.removeItem(key);
		} catch (e) {
			console.warn("Cannot remove item from localStorage");
		}
	},
	clear() {
		try {
			window.localStorage.clear();
		} catch (e) {
			console.warn("Cannot clear localStorage");
		}
	},
};