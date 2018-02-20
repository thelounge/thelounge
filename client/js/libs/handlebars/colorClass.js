"use strict";

// Generates a string from "color-1" to "color-32" based on an input string
module.exports = function(str) {
	let hash = 0;

	for (let i = 0; i < str.length; i++) {
		hash += str.charCodeAt(i);
	}

	return "color-" + (1 + hash % 32);
};
