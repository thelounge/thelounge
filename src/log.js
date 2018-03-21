"use strict";

const colors = require("chalk");
const moment = require("moment");
const read = require("read");
const Helper = require("./helper");

function timestamp() {
	const format = Helper.config.logs.format || "YYYY-MM-DD HH:mm:ss";
	const tz = Helper.config.logs.timezone || "UTC+00:00";
	const time = moment().utcOffset(tz).format(format);

	return colors.dim(time);
}

module.exports = {
	/* eslint-disable no-console */
	error(...args) {
		console.error(timestamp(), colors.red("[ERROR]"), ...args);
	},
	warn(...args) {
		console.error(timestamp(), colors.yellow("[WARN]"), ...args);
	},
	info(...args) {
		console.log(timestamp(), colors.blue("[INFO]"), ...args);
	},
	debug(...args) {
		console.log(timestamp(), colors.green("[DEBUG]"), ...args);
	},
	raw(...args) {
		console.log(...args);
	},
	/* eslint-enable no-console */

	prompt(options, callback) {
		options.prompt = [timestamp(), colors.cyan("[PROMPT]"), options.text].join(" ");
		read(options, callback);
	},
};
