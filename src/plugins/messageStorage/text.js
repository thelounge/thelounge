"use strict";

const log = require("../../log");
const fs = require("fs");
const fsextra = require("fs-extra");
const path = require("path");
const filenamify = require("filenamify");
const Helper = require("../../helper");
const Msg = require("../../models/msg");

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

		const logPath = path.join(
			Helper.getUserLogsPath(),
			this.client.name,
			TextFileMessageStorage.getNetworkFolderName(network)
		);

		try {
			fsextra.ensureDirSync(logPath);
		} catch (e) {
			log.error("Unable to create logs directory", e);
			return;
		}

		let line = `[${msg.time.toISOString()}] `;

		// message types from src/models/msg.js
		switch (msg.type) {
			case Msg.Type.ACTION:
				// [2014-01-01 00:00:00] * @Arnold is eating cookies
				line += `* ${msg.from.mode}${msg.from.nick} ${msg.text}`;
				break;
			case Msg.Type.JOIN:
				// [2014-01-01 00:00:00] *** Arnold (~arnold@foo.bar) joined
				line += `*** ${msg.from.nick} (${msg.hostmask}) joined`;
				break;
			case Msg.Type.KICK:
				// [2014-01-01 00:00:00] *** Arnold was kicked by Bernie (Don't steal my cookies!)
				line += `*** ${msg.target.nick} was kicked by ${msg.from.nick} (${msg.text})`;
				break;
			case Msg.Type.MESSAGE:
				// [2014-01-01 00:00:00] <@Arnold> Put that cookie down.. Now!!
				line += `<${msg.from.mode}${msg.from.nick}> ${msg.text}`;
				break;
			case Msg.Type.MODE:
				// [2014-01-01 00:00:00] *** Arnold set mode +o Bernie
				line += `*** ${msg.from.nick} set mode ${msg.text}`;
				break;
			case Msg.Type.NICK:
				// [2014-01-01 00:00:00] *** Arnold changed nick to Bernie
				line += `*** ${msg.from.nick} changed nick to ${msg.new_nick}`;
				break;
			case Msg.Type.NOTICE:
				// [2014-01-01 00:00:00] -Arnold- pssst, I have cookies!
				line += `-${msg.from.nick}- ${msg.text}`;
				break;
			case Msg.Type.PART:
				// [2014-01-01 00:00:00] *** Arnold (~arnold@foo.bar) left (Bye all!)
				line += `*** ${msg.from.nick} (${msg.hostmask}) left (${msg.text})`;
				break;
			case Msg.Type.QUIT:
				// [2014-01-01 00:00:00] *** Arnold (~arnold@foo.bar) quit (Connection reset by peer)
				line += `*** ${msg.from.nick} (${msg.hostmask}) quit (${msg.text})`;
				break;
			case Msg.Type.CHGHOST:
				// [2014-01-01 00:00:00] *** Arnold changed host to: new@fancy.host
				line += `*** ${msg.from.nick} changed host to '${msg.new_ident}@${msg.new_host}'`;
				break;
			case Msg.Type.TOPIC:
				// [2014-01-01 00:00:00] *** Arnold changed topic to: welcome everyone!
				line += `*** ${msg.from.nick} changed topic to '${msg.text}'`;
				break;

			default:
				// unhandled events will not be logged
				return;
		}

		line += "\n";

		fs.appendFile(path.join(logPath, `${cleanFilename(channel.name)}.log`), line, (e) => {
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

	static getNetworkFolderName(network) {
		// Limit network name in the folder name to 23 characters
		// So we can still fit 12 characters of the uuid for de-duplication
		const networkName = cleanFilename(network.name.substring(0, 23).replace(/ /g, "-"));

		return `${networkName}-${network.uuid.substring(networkName.length + 1)}`;
	}
}

module.exports = TextFileMessageStorage;

function cleanFilename(name) {
	name = filenamify(name, {replacement: "_"});
	name = name.toLowerCase();

	return name;
}
