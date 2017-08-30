"use strict";

const fs = require("fs");
const fsextra = require("fs-extra");
const moment = require("moment");
const path = require("path");
const sanitizeFilename = require("sanitize-filename");
const readLastLines = require("read-last-lines");
const Helper = require("./helper");
const Msg = require("./models/msg");

module.exports = class UserLog {
	constructor(name) {
		this.name = name;
	}

	static parseLine(line) {
		let result = /^\[(.*)\] <(.*)> (.*)$/.exec(line);

		if (result) {
			return new Msg({
				// time: result[1],
				from: result[2],
				text: result[3],
			});
		}

		result = /^\[(.*)\] \* (\S+)(?: \((\S+)\))? ([a-z_]+)(?: (.*))?$/.exec(line);

		if (!result) {
			return;
		}

		const from = result[2];
		const hostmask = result[3];
		const type = result[4];
		const remaining = result[5];

		const msg = new Msg({
			// time: time,
			from: from,
			type: type,
		});

		switch (type) {
		case "action":
			msg.text = remaining;
			return msg;
		case "join":
			msg.hostmask = hostmask;
			return msg;
		case "mode":
			msg.text = remaining;
			return msg;
		case "nick":
			msg.new_nick = remaining;
			return msg;
		case "part":
		case "quit":
			msg.hostmask = hostmask;
			if (remaining) {
				msg.text = remaining;
			}
			return msg;
		case "topic":
			msg.text = remaining;
			return msg;
		}
	}

	read(network, chan, callback) {
		readLastLines
			.read(this.getLogFilePath(network, chan), 100)
			.then((lines) => {
				const messages = [];

				lines.split("\n").forEach((line) => {
					const msg = UserLog.parseLine(line);
					if (msg) {
						messages.push(msg);
					}
				});

				callback(messages);
			})
			.catch((err) => {
				log.error(`Failed to read user logs: ${err}`);
			});
	}

	write(network, chan, msg) {
		const logPath = Helper.getUserLogsPath(this.name, sanitizeFilename(network));

		try {
			fsextra.ensureDirSync(logPath);
		} catch (e) {
			log.error("Unabled to create logs directory", e);
			return;
		}

		var format = Helper.config.logs.format || "YYYY-MM-DD HH:mm:ss";
		var tz = Helper.config.logs.timezone || "UTC+00:00";

		var time = moment().utcOffset(tz).format(format);
		var line = `[${time}] `;

		var type = msg.type.trim();
		if (type === "message" || type === "highlight") {
			// Format:
			// [2014-01-01 00:00:00] <Arnold> Put that cookie down.. Now!!
			line += `<${msg.from}> ${msg.text}`;
		} else {
			// Format:
			// [2014-01-01 00:00:00] * Arnold quit
			line += `* ${msg.from} `;

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

		fs.appendFile(
			this.getLogFilePath(network, chan),
			line + "\n",
			function(e) {
				if (e) {
					log.error("Failed to write user log", e);
				}
			}
		);
	}

	getLogFilePath(network, channel) {
		return path.join(
			Helper.getUserLogsPath(this.name, sanitizeFilename(network)),
			sanitizeFilename(channel) + ".log"
		);
	}
};
