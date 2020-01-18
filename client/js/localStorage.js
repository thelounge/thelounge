"use strict";

// This is a simple localStorage wrapper because browser can throw errors
// in different situations, including:
// - Unable to store data if storage is full
// - Local storage is blocked if "third-party cookies and site data" is disabled
//
// For more details, see:
// https://stackoverflow.com/q/14555347/1935861
// https://github.com/thelounge/thelounge/issues/2699
// https://www.chromium.org/for-testers/bug-reporting-guidelines/uncaught-securityerror-failed-to-read-the-localstorage-property-from-window-access-is-denied-for-this-document

export default {
	set(key, value) {
		try {
			window.localStorage.setItem(key, value);
		} catch (e) {
			//
		}
	},
	get(key) {
		try {
			return window.localStorage.getItem(key);
		} catch (e) {
			// Return null as if data is not set
			return null;
		}
	},
	remove(key) {
		try {
			window.localStorage.removeItem(key);
		} catch (e) {
			//
		}
	},
	clear() {
		try {
			window.localStorage.clear();
		} catch (e) {
			//
		}
	},
};
