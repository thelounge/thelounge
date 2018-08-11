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
			// Do nothing. You can end up here because localStorage isn't
			// accessable due to browser blocking 3rd party cookies when
			// theLounge is loaded via iFrame.
			// See: https://github.com/thelounge/thelounge/issues/2699

			// Return null as if we we're a new client
			return null;
		}
	},
	remove(key) {
		try {
			window.localStorage.removeItem(key);
		} catch (e) {
			// Do nothing. You can end up here because localStorage isn't
			// accessable due to browser blocking 3rd party cookies when
			// theLounge is loaded via iFrame
			// See: https://github.com/thelounge/thelounge/issues/2699
		}
	},
	clear() {
		try {
			window.localStorage.clear();
		} catch (e) {
			// Do nothing. You can end up here because localStorage isn't
			// accessable due to browser blocking 3rd party cookies when
			// theLounge is loaded via iFrame
			// See: https://github.com/thelounge/thelounge/issues/2699
		}
	},
};
