var Handlebars = require("handlebars");
Handlebars.registerHelper(
	"users", function(count) {
		return count + " " + (count == 1 ? "user" : "users");
	}
);
