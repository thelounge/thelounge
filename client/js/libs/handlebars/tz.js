Handlebars.registerHelper(
	"tz", function(time) {
		var utc = moment.utc(time, "HH:mm:ss").toDate();
		return moment(utc).format("HH:mm");
	}
);
