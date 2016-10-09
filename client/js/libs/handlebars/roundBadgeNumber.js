"use strict";

Handlebars.registerHelper(
	"roundBadgeNumber", function(count) {
		if (count < 1000) {
			return count;
		}

		return (count / 1000).toFixed(2).slice(0, -1) + "k";
	}
);
