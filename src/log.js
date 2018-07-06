"use strict";

const colors = require("chalk");
const read = require("read");
const moment = require("moment");

function timestamp() {
	return colors.dim(module.exports.getHumanDate());
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

	getHumanDate() {
		return moment().format("YYYY-MM-DD HH:mm:ss");
	},
};
