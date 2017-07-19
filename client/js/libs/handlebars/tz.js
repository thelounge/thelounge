"use strict";

const moment = require("moment");
const constants = require("../../constants");

module.exports = function(time) {
	const options = require("../../options");
	let format;

	if (options.use12hClock) {
		format = options.showSeconds ? constants.timeFormats.msg12hWithSeconds : constants.timeFormats.msg12h;
	} else {
		format = options.showSeconds ? constants.timeFormats.msgWithSeconds : constants.timeFormats.msgDefault;
	}

	return moment(time).format(format);
};
