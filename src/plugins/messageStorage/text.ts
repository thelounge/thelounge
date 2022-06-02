/* eslint-disable @typescript-eslint/restrict-template-expressions */
import fs from "fs";
import path from "path";
import filenamify from "filenamify";

import log from "../../log";
import Config from "../../config";
import {MessageStorage} from "./types";
import Client from "../../client";
import Channel from "../../models/chan";
import {Message, MessageType} from "../../models/msg";
import Network from "../../models/network";

class TextFileMessageStorage implements MessageStorage {
	client: Client;
	isEnabled: boolean;

	constructor(client: Client) {
		this.client = client;
		this.isEnabled = false;
	}

	enable() {
		this.isEnabled = true;
	}

	close(callback: () => void) {
		this.isEnabled = false;

		if (callback) {
			callback();
		}
	}

	index(network: Network, channel: Channel, msg: Message) {
		if (!this.isEnabled) {
			return;
		}

		const logPath = path.join(
			Config.getUserLogsPath(),
			this.client.name,
			TextFileMessageStorage.getNetworkFolderName(network)
		);

		try {
			fs.mkdirSync(logPath, {recursive: true});
		} catch (e: any) {
			log.error("Unable to create logs directory", String(e));
			return;
		}

		let line = `[${msg.time.toISOString()}] `;

		// message types from src/models/msg.js
		switch (msg.type) {
			case MessageType.ACTION:
				// [2014-01-01 00:00:00] * @Arnold is eating cookies
				line += `* ${msg.from.mode}${msg.from.nick} ${msg.text}`;
				break;
			case MessageType.JOIN:
				// [2014-01-01 00:00:00] *** Arnold (~arnold@foo.bar) joined
				line += `*** ${msg.from.nick} (${msg.hostmask}) joined`;
				break;
			case MessageType.KICK:
				// [2014-01-01 00:00:00] *** Arnold was kicked by Bernie (Don't steal my cookies!)
				line += `*** ${msg.target.nick} was kicked by ${msg.from.nick} (${msg.text})`;
				break;
			case MessageType.MESSAGE:
				// [2014-01-01 00:00:00] <@Arnold> Put that cookie down.. Now!!
				line += `<${msg.from.mode}${msg.from.nick}> ${msg.text}`;
				break;
			case MessageType.MODE:
				// [2014-01-01 00:00:00] *** Arnold set mode +o Bernie
				line += `*** ${msg.from.nick} set mode ${msg.text}`;
				break;
			case MessageType.NICK:
				// [2014-01-01 00:00:00] *** Arnold changed nick to Bernie
				line += `*** ${msg.from.nick} changed nick to ${msg.new_nick}`;
				break;
			case MessageType.NOTICE:
				// [2014-01-01 00:00:00] -Arnold- pssst, I have cookies!
				line += `-${msg.from.nick}- ${msg.text}`;
				break;
			case MessageType.PART:
				// [2014-01-01 00:00:00] *** Arnold (~arnold@foo.bar) left (Bye all!)
				line += `*** ${msg.from.nick} (${msg.hostmask}) left (${msg.text})`;
				break;
			case MessageType.QUIT:
				// [2014-01-01 00:00:00] *** Arnold (~arnold@foo.bar) quit (Connection reset by peer)
				line += `*** ${msg.from.nick} (${msg.hostmask}) quit (${msg.text})`;
				break;
			case MessageType.CHGHOST:
				// [2014-01-01 00:00:00] *** Arnold changed host to: new@fancy.host
				line += `*** ${msg.from.nick} changed host to '${msg.new_ident}@${msg.new_host}'`;
				break;
			case MessageType.TOPIC:
				// [2014-01-01 00:00:00] *** Arnold changed topic to: welcome everyone!
				line += `*** ${msg.from.nick} changed topic to '${msg.text}'`;
				break;

			default:
				// unhandled events will not be logged
				return;
		}

		line += "\n";

		fs.appendFile(
			path.join(logPath, TextFileMessageStorage.getChannelFileName(channel)),
			line,
			(e) => {
				if (e) {
					log.error("Failed to write user log", e.message);
				}
			}
		);
	}

	deleteChannel() {
		/* TODO: Truncating text logs is disabled, until we figure out some UI for it
		if (!this.isEnabled) {
			return;
		}

		const logPath = path.join(
			Config.getUserLogsPath(),
			this.client.name,
			TextFileMessageStorage.getNetworkFolderName(network),
			TextFileMessageStorage.getChannelFileName(channel)
		);

		fs.truncate(logPath, 0, (e) => {
			if (e) {
				log.error("Failed to truncate user log", e);
			}
		});*/
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

	static getNetworkFolderName(network: Network) {
		// Limit network name in the folder name to 23 characters
		// So we can still fit 12 characters of the uuid for de-duplication
		const networkName = cleanFilename(network.name.substring(0, 23).replace(/ /g, "-"));

		return `${networkName}-${network.uuid.substring(networkName.length + 1)}`;
	}

	static getChannelFileName(channel: Channel) {
		return `${cleanFilename(channel.name)}.log`;
	}
}

export default TextFileMessageStorage;

function cleanFilename(name: string) {
	name = filenamify(name, {replacement: "_"});
	name = name.toLowerCase();

	return name;
}
