"use strict";

const $ = require("jquery");

exports.input = function() {
	$(".chan.active .toggle-button.toggle-preview:not(.opened)").click();
	return true;
};
