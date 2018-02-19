"use strict";

let diff;

module.exports = function(a, opt) {
	if (a !== diff) {
		diff = a;
		return opt.fn(this);
	}

	return opt.inverse(this);
};
