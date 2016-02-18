var Handlebars = require('handlebars');
Handlebars.registerHelper(
	"modes", function(mode) {
		var modes = {
			"~": "owner",
			"&": "admin",
			"@": "op",
			"%": "half-op",
			"+": "voice",
			"" : "normal"
		};
		return modes[mode];
	}
);
