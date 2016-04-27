var colors = require("colors/safe");
var moment = require("moment");
var Helper = require("./helper");

function timestamp(type, messageArgs) {
	var config = Helper.getConfig();
	var format = (config.logs || {}).format || "YYYY-MM-DD HH:mm:ss";
	var tz = (config.logs || {}).timezone || "UTC+00:00";

	var time = moment().utcOffset(tz).format(format);

	Array.prototype.unshift.call(messageArgs, colors.dim(time), type);

	return messageArgs;
}

exports.error = function() {
	console.error.apply(console, timestamp(colors.red("[ERROR]"), arguments));
};

exports.warn = function() {
	console.error.apply(console, timestamp(colors.yellow("[WARN]"), arguments));
};

exports.info = function() {
	console.log.apply(console, timestamp(colors.blue("[INFO]"), arguments));
};

exports.debug = function() {
	console.log.apply(console, timestamp(colors.green("[DEBUG]"), arguments));
};
