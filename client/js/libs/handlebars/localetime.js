"use strict";

Handlebars.registerHelper("localetime", function(time) {
	return new Date(time).toLocaleString();
});
