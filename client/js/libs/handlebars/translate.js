"use strict";
const t = require("../../translate");
const Handlebars = require("handlebars/runtime");

module.exports = function(i18n_key, options) {
	let result = null;
	console.log(i18n_key)
	if (options && options.hash) {
		result = t.translate(i18n_key, options.hash);
	} else {
		result = t.translate(i18n_key);
	}

	return new Handlebars.SafeString(result);
};
