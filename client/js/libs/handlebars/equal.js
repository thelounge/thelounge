"use strict";

module.exports = function(a, b, opt) {
	a = a.toString();
	b = b.toString();
	if (a === b) {
		return opt.fn(this);
	}

	return opt.inverse(this);
};
