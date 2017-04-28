"use strict";

const moment = require("moment");

module.exports = function(time) {
	// See http://momentjs.com/docs/#/displaying/calendar-time/
	return moment(new Date(time)).calendar(null, {
		sameDay: "[Today]",
		lastDay: "[Yesterday]",
		lastWeek: "L", // Locale
		sameElse: "L"
	});
};
