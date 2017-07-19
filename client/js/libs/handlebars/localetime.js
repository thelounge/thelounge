"use strict";

const moment = require("moment");
const constants = require("../../constants");

module.exports = function(time) {
	const options = require("../../options");
	let format = "D MMMM YYYY, ";

	if (options.use12hClock) {
		format += constants.timeFormats.msg12hWithSeconds;
	} else {
		format += constants.timeFormats.msgWithSeconds;
	}

	return moment(time).format(format);
};
