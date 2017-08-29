"use strict";

const moment = require("moment");

module.exports = function(time) {
	return moment(time).format("D MMMM YYYY");
};
