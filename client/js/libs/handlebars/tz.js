"use strict";

const moment = require("moment");
const constants = require("../../constants");

module.exports = function(time) {
	const options = require("../../options");
	const format = options.showSeconds ? constants.timeFormats.msgWithSeconds : constants.timeFormats.msgDefault;
	return moment(time).format(format);
};
