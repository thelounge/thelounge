"use strict";

Handlebars.registerHelper(
	"toJSON", function(context) {
		return JSON.stringify(context);
	}
);
