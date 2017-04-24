"use strict";

module.exports = function(orig) {
	return orig.toLowerCase().replace(/[^a-z0-9]/, "-");
};
