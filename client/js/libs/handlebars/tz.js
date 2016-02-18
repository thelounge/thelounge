var Handlebars = require("handlebars");
var moment = require("moment");
Handlebars.registerHelper(
	"tz", function(time) {
		if (time) {
			var utc = moment.utc(time, "HH:mm:ss").toDate();
			return moment(utc).format("HH:mm");
		} else {
			return "";
		}
	}
);
