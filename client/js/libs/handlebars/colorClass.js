"use strict";

const $ = require("jquery");

// Generates a string from hsl(h, s%, l%) based on user prefs and user hash
module.exports = (function() {
	var strHash = function(str) {
		str = str || "";
		if (str.length === 0) {
			return 0;
		}
		var hash = 0, i, chr;
		for (i = 0; i < str.length; i++) {
			chr = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return 1 + hash % 359;
	};

	return function(str) {
		var hash = strHash(str);
		var sat = $("#sat-select").val() || 70;
		var l = $("#light-select").val() || 85;

		return "hsl(" + hash + ", " + sat + "%, " + l + "%)";
	};
})();
