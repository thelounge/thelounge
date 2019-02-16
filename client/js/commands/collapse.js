"use strict";

const $ = require("jquery");

exports.input = function() {
	$(".chan.active .toggle-button.toggle-preview.opened").click();
	return true;
};
