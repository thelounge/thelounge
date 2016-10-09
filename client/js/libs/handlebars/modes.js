"use strict";

Handlebars.registerHelper(
	"modes", function(mode) {
		var modes = {
			"~": "owner",
			"&": "admin",
			"!": "admin",
			"@": "op",
			"%": "half-op",
			"+": "voice",
			"": "normal"
		};
		return modes[mode];
	}
);
