var fs = require("fs");
var mkdirp = require("mkdirp");
var moment = require("moment");
var Helper = require("./helper");

module.exports.write = function(user, network, chan, msg) {
	try {
		var path = Helper.HOME + "/logs/" + user + "/" + network;
		mkdirp.sync(path);
	} catch (e) {
		log.error("Unabled to create logs directory", e);
		return;
	}

	var config = Helper.getConfig();
	var format = (config.logs || {}).format || "YYYY-MM-DD HH:mm:ss";
	var tz = (config.logs || {}).timezone || "UTC+00:00";

	var time = moment().utcOffset(tz).format(format);
	var line = "[" + time + "] ";

	var type = msg.type.trim();
	if (type === "message" || type === "highlight") {
		// Format:
		// [2014-01-01 00:00:00] <Arnold> Put that cookie down.. Now!!
		line += "<" + msg.from + "> " + msg.text;
	} else {
		// Format:
		// [2014-01-01 00:00:00] * Arnold quit
		line += "* " + msg.from + " " + msg.type;
		if (msg.text) {
			line += " " + msg.text;
		}
	}

	fs.appendFile(
		// Quick fix to escape pre-escape channel names that contain % using %%,
		// and / using %. **This does not escape all reserved words**
		path + "/" + chan.replace(/%/g, "%%").replace(/\//g, "%") + ".log",
		line + "\n",
		function(e) {
			log.error("Failed to write user log", e);
		}
	);
};
