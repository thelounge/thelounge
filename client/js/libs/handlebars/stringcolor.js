var Handlebars = require('handlebars');
Handlebars.registerHelper(
	"stringcolor", function(str) {
		return stringcolor(str);
	}
);
