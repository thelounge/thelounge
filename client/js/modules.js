"use strict";

// vendor libraries
const $ = require("jquery");

// our libraries
const utils = require("./utils");

module.exports = {
	clear,
	collapse,
	expand,
	join
};

function clear() {
	utils.clear();
}

function collapse() {
	$(".chan.active .toggle-button.opened").click();
}

function expand() {
	$(".chan.active .toggle-button:not(.opened)").click();
}

function join(channel) {
	var chan = utils.findCurrentNetworkChan(channel);

	if (chan.length) {
		chan.click();
		return true;
	}
}
