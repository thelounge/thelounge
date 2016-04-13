Handlebars.registerHelper(
	"localeDate", function(date) {
		date = new Date(date);

		return date.toLocaleString();
	}
);
