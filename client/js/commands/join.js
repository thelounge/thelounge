"use strict";

const utils = require("../utils");

exports.input = function(args) {
	const channel = args[0];

	if (channel) {
		const chan = utils.findCurrentNetworkChan(channel);

		if (chan.length) {
			chan.trigger("click");
		}
	}
};
