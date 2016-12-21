"use strict";

Handlebars.registerHelper(
	"humanReadableRange", function(seconds) {
		var plural = function(number) {
			return (number === 1) ? "" : "s";
		};

		if (seconds === 0) {
			return "0 seconds";
		}

		var result = [];

		var weeks = Math.floor(seconds / 604800);
		if (weeks) {
			result.push(weeks + " week" + plural(weeks));
		}

		var days = Math.floor((seconds %= 604800) / 86400);
		if (days) {
			result.push(days + " day" + plural(days));
		}

		var hours = Math.floor((seconds %= 86400) / 3600);
		if (hours) {
			result.push(hours + " hour" + plural(hours));
		}

		var minutes = Math.floor((seconds %= 3600) / 60);
		if (minutes) {
			result.push(minutes + " minute" + plural(minutes));
		}

		var remainingSeconds = seconds % 60;
		if (remainingSeconds) {
			result.push(remainingSeconds + " second" + plural(remainingSeconds));
		}

		var lastItem = result.pop();

		if (result.length > 0) {
			return result.join(", ") + " and " + lastItem;
		}
		return lastItem;
	}
);
