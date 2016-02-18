var Handlebars = require("handlebars");
Handlebars.registerHelper(
	"diff", function(a, opt) {
		var diff;
		if (a != diff) {
			diff = a;
			return opt.fn(this);
		} else {
			return opt.inverse(this);
		}
	}
);
