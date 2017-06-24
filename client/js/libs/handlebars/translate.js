"use strict";
const t = require("../../translate");
const Handlebars = require("handlebars/runtime");
module.exports = function(i18n_key) {
	console.log(i18n_key);
	const result = t.translate(i18n_key);
	console.log(result);
	return new Handlebars.SafeString(result);
};
