"use strict";

module.exports = function(a, b, opt) {
	if (arguments.length !== 3) {
		throw new Error("Handlebars helper `notEqual` expects 3 arguments");
	}

	a = a.toString();
	b = b.toString();

	if (a !== b) {
		return opt.fn(this);
	}

	if (opt.inverse(this) !== "") {
		throw new Error("Handlebars helper `notEqual` does not take an `else` block");
	}
};
