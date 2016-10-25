"use strict";

var fs = require("fs");
var fsextra = require("fs-extra");
var moment = require("moment");
var Helper = require("./helper");
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

	read(network, chan) {
		let data;

		try {
			data = fs.readFileSync(
				`${Helper.getUserLogsPath(this.name, network)}/${chan}.log`,
				"utf-8"
			).toString().split("\n");
		} catch (e) {
			return [];
		}

		// var format = Helper.config.logs.format || "YYYY-MM-DD HH:mm:ss";
		// var tz = Helper.config.logs.timezone || "UTC+00:00";

		var messages = [];

		data.forEach((line) => {
			const msg = UserLog.parseLine(line);
			if (msg) {
				messages.push(msg);
			}
		});

		return messages;
	}

	write(network, chan, msg) {
		const path = Helper.getUserLogsPath(this.name, network);

		try {
			fsextra.ensureDirSync(path);
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
	}
};
