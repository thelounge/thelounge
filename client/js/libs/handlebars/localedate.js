"use strict";

Handlebars.registerHelper("localedate", function(time) {
	return new Date(time).toLocaleDateString();
});
