"use strict";

const moment = require("moment");
const constants = require("../../constants");

module.exports = function(time) {
	const parsedTime = moment(time);
	const format = constants.timeFormats.msgDefault;
	return parsedTime.format(format) + '<span class="seconds">:' + parsedTime.format("ss") + "</span>";
};
