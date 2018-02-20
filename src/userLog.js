"use strict";

const fs = require("fs");
const fsextra = require("fs-extra");
const moment = require("moment");
const Helper = require("./helper");

module.exports.write = function(user, network, chan, msg) {
	const path = Helper.getUserLogsPath(user, network);

	try {
		fsextra.ensureDirSync(path);
	} catch (e) {
		log.error("Unable to create logs directory", e);
		return;
	}

	const format = Helper.config.logs.format || "YYYY-MM-DD HH:mm:ss";
	const tz = Helper.config.logs.timezone || "UTC+00:00";

	const time = moment(msg.time).utcOffset(tz).format(format);
	let line = `[${time}] `;

	const type = msg.type.trim();

	if (type === "message" || type === "highlight") {
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

	fs.appendFile(
		// Quick fix to escape pre-escape channel names that contain % using %%,
		// and / using %. **This does not escape all reserved words**
		path + "/" + chan.replace(/%/g, "%%").replace(/\//g, "%") + ".log",
		line + "\n",
		function(e) {
			if (e) {
				log.error("Failed to write user log", e);
			}
		}
	);
};
