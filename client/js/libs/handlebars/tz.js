Handlebars.registerHelper(
	"tz", function(time) {
		time = new Date(time);
		var h = time.getHours();
		var m = time.getMinutes();

		if (h < 10) {
			h = "0" + h;
		}

		if (m < 10) {
			m = "0" + m;
		}

		return h + ":" + m;
	}
);
