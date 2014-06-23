var config = require("../config") || {};
var fs = require("fs");
var moment = require("moment");

module.exports = function log(chan, msg) {
	var client = chan.network.client;
	if (!client.config.log) {
		return;
	}
	
	var network = chan.network.name;
	var dir = "logs/";
	
	dir += client.name + "/";
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	
	dir += network + "/";
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	
	var date = moment().format("YYYY-MM-DD HH:mm");
	var line = "[" + date + "] ";
	if (msg.type == "normal") {
		line += "<"
			+ msg.from + "> "
			+ msg.text;
	} else {
		line += "* "
			+ msg.from + " "
			+ msg.type + " "
			+ msg.text;
	}
	
	var file = dir + chan.name + ".log";
	fs.appendFile(
		file,
		line + "\n"
	);
};
