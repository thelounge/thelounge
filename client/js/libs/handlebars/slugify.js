"use strict";

const escape = require("css.escape");

module.exports = function(orig) {
	return escape(orig.toLowerCase());
};
