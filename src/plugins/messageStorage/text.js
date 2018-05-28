"use strict";

const fs = require("fs");
const fsextra = require("fs-extra");
const path = require("path");
const moment = require("moment");
const filenamify = require("filenamify");
const Helper = require("../../helper");

class TextFileMessageStorage {
	constructor(client) {
		this.client = client;
		this.isEnabled = false;
	}

	enable() {
		this.isEnabled = true;
	}

	close(callback) {
		this.isEnabled = false;

		if (callback) {
			callback();
		}
	}

	index(network, channel, msg) {
		if (!this.isEnabled) {
			return;
		}

		const networkFolderName = cleanFilename(`${network.name}-${network.uuid.substring(network.name.length + 1)}`);
		const logPath = path.join(Helper.getUserLogsPath(), this.client.name, networkFolderName);

		try {
			fsextra.ensureDirSync(logPath);
		} catch (e) {
			log.error("Unable to create logs directory", e);
			return;
		}

		const format = Helper.config.logs.format || "YYYY-MM-DD HH:mm:ss";
		const tz = Helper.config.logs.timezone || "UTC+00:00";

		const time = moment(msg.time).utcOffset(tz).format(format);
		let line = `[${time}] `;

		if (msg.type === "message") {
			// Format:
			// [2014-01-01 00:00:00] <Arnold> Put that cookie down.. Now!!
			line += `<${msg.from.nick}> ${msg.text}`;
		} else {
			// Format:
			// [2014-01-01 00:00:00] * Arnold quit
			line += `* ${msg.from.nick} `;

			if (msg.hostmask) {
				line += `(${msg.hostmask}) `;
			}

			line += msg.type;

			if (msg.new_nick) { // `/nick <new_nick>`
				line += ` ${msg.new_nick}`;
			} else if (msg.text) {
				line += ` ${msg.text}`;
			}
		}

		line += "\n";

		fs.appendFile(path.join(logPath, cleanFilename(channel.name)), line, (e) => {
			if (e) {
				log.error("Failed to write user log", e);
			}
		});
	}

	getMessages() {
		// Not implemented for text log files
		// They do not contain enough data to fully re-create message objects
		// Use sqlite storage instead
		return Promise.resolve([]);
	}

	canProvideMessages() {
		return false;
	}
}

module.exports = TextFileMessageStorage;

function cleanFilename(name) {
	name = filenamify(name, {replacement: "_"});
	name = name.toLowerCase();

	return `${name}.log`;
}
