import type {Database} from "sqlite3";

import log from "../../log";
import path from "path";
import fs from "fs";
import Config from "../../config";
import Msg, {Message} from "../../models/msg";
import Client from "../../client";
import Chan, {Channel} from "../../models/chan";
import type {
	SearchResponse,
	SearchQuery,
	SqliteMessageStorage as ISqliteMessageStorage,
} from "./types";
import Network from "../../models/network";

// TODO; type
let sqlite3: any;

try {
	sqlite3 = require("sqlite3");
} catch (e: any) {
	Config.values.messageStorage = Config.values.messageStorage.filter((item) => item !== "sqlite");

	log.error(
		"Unable to load sqlite3 module. See https://github.com/mapbox/node-sqlite3/wiki/Binaries"
	);
}

const currentSchemaVersion = 1520239200;

const schema = [
	// Schema version #1
	"CREATE TABLE IF NOT EXISTS options (name TEXT, value TEXT, CONSTRAINT name_unique UNIQUE (name))",
	"CREATE TABLE IF NOT EXISTS messages (network TEXT, channel TEXT, time INTEGER, type TEXT, msg TEXT)",
	"CREATE INDEX IF NOT EXISTS network_channel ON messages (network, channel)",
	"CREATE INDEX IF NOT EXISTS time ON messages (time)",
];

class SqliteMessageStorage implements ISqliteMessageStorage {
	client: Client;
	isEnabled: boolean;
	database!: Database;

	constructor(client: Client) {
		this.client = client;
		this.isEnabled = false;
	}

	enable() {
		const logsPath = Config.getUserLogsPath();
		const sqlitePath = path.join(logsPath, `${this.client.name}.sqlite3`);

		try {
			fs.mkdirSync(logsPath, {recursive: true});
		} catch (e: any) {
			log.error("Unable to create logs directory", String(e));

			return;
		}

		this.isEnabled = true;

		this.database = new sqlite3.Database(sqlitePath);
		this.database.serialize(() => {
			schema.forEach((line) => this.database.run(line));

			this.database.get(
				"SELECT value FROM options WHERE name = 'schema_version'",
				(err, row) => {
					if (err) {
						return log.error(`Failed to retrieve schema version: ${err.toString()}`);
					}

					// New table
					if (row === undefined) {
						this.database.serialize(() =>
							this.database.run(
								"INSERT INTO options (name, value) VALUES ('schema_version', ?)",
								currentSchemaVersion
							)
						);

						return;
					}

					const storedSchemaVersion = parseInt(row.value, 10);

					if (storedSchemaVersion === currentSchemaVersion) {
						return;
					}

					if (storedSchemaVersion > currentSchemaVersion) {
						return log.error(
							`sqlite messages schema version is higher than expected (${storedSchemaVersion} > ${currentSchemaVersion}). Is The Lounge out of date?`
						);
					}

					log.info(
						`sqlite messages schema version is out of date (${storedSchemaVersion} < ${currentSchemaVersion}). Running migrations if any.`
					);

					this.database.serialize(() =>
						this.database.run(
							"UPDATE options SET value = ? WHERE name = 'schema_version'",
							currentSchemaVersion
						)
					);
				}
			);
		});
	}

	close(callback?: (error?: Error | null) => void) {
		if (!this.isEnabled) {
			return;
		}

		this.isEnabled = false;

		this.database.close((err) => {
			if (err) {
				log.error(`Failed to close sqlite database: ${err.message}`);
			}

			if (callback) {
				callback(err);
			}
		});
	}

	index(network: Network, channel: Chan, msg: Msg) {
		if (!this.isEnabled) {
			return;
		}

		const clonedMsg = Object.keys(msg).reduce((newMsg, prop) => {
			// id is regenerated when messages are retrieved
			// previews are not stored because storage is cleared on lounge restart
			// type and time are stored in a separate column
			if (prop !== "id" && prop !== "previews" && prop !== "type" && prop !== "time") {
				newMsg[prop] = msg[prop];
			}

			return newMsg;
		}, {});

		this.database.serialize(() =>
			this.database.run(
				"INSERT INTO messages(network, channel, time, type, msg) VALUES(?, ?, ?, ?, ?)",
				network.uuid,
				channel.name.toLowerCase(),
				msg.time.getTime(),
				msg.type,
				JSON.stringify(clonedMsg)
			)
		);
	}

	deleteChannel(network: Network, channel: Channel) {
		if (!this.isEnabled) {
			return;
		}

		this.database.serialize(() =>
			this.database.run(
				"DELETE FROM messages WHERE network = ? AND channel = ?",
				network.uuid,
				channel.name.toLowerCase()
			)
		);
	}

	/**
	 * Load messages for given channel on a given network and resolve a promise with loaded messages.
	 *
	 * @param Network network - Network object where the channel is
	 * @param Chan channel - Channel object for which to load messages for
	 */
	getMessages(network: Network, channel: Channel) {
		if (!this.isEnabled || Config.values.maxHistory === 0) {
			return Promise.resolve([]);
		}

		// If unlimited history is specified, load 100k messages
		const limit = Config.values.maxHistory < 0 ? 100000 : Config.values.maxHistory;

		return new Promise((resolve, reject) => {
			this.database.serialize(() =>
				this.database.all(
					"SELECT msg, type, time FROM messages WHERE network = ? AND channel = ? ORDER BY time DESC LIMIT ?",
					[network.uuid, channel.name.toLowerCase(), limit],
					(err, rows) => {
						if (err) {
							return reject(err);
						}

						resolve(
							rows.reverse().map((row) => {
								const msg = JSON.parse(row.msg);
								msg.time = row.time;
								msg.type = row.type;

								const newMsg = new Msg(msg);
								newMsg.id = this.client.idMsg++;

								return newMsg;
							})
						);
					}
				)
			);
		}) as Promise<Message[]>;
	}

	search(query: SearchQuery): Promise<SearchResponse> {
		if (!this.isEnabled) {
			// this should never be hit as messageProvider is checked in client.search()
			return Promise.reject(
				"search called but sqlite provider not enabled. This is a programming error"
			);
		}

		// Using the '@' character to escape '%' and '_' in patterns.
		const escapedSearchTerm = query.searchTerm.replace(/([%_@])/g, "@$1");

		let select =
			'SELECT msg, type, time, network, channel FROM messages WHERE type = "message" AND json_extract(msg, "$.text") LIKE ? ESCAPE \'@\'';
		const params = [`%${escapedSearchTerm}%`];

		if (query.networkUuid) {
			select += " AND network = ? ";
			params.push(query.networkUuid);
		}

		if (query.channelName) {
			select += " AND channel = ? ";
			params.push(query.channelName.toLowerCase());
		}

		const maxResults = 100;

		select += " ORDER BY time DESC LIMIT ? OFFSET ? ";
		params.push(maxResults.toString());
		query.offset = parseInt(query.offset as string, 10) || 0;
		params.push(String(query.offset));

		return new Promise((resolve, reject) => {
			this.database.all(select, params, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					const response: SearchResponse = {
						searchTerm: query.searchTerm,
						target: query.channelName,
						networkUuid: query.networkUuid,
						offset: query.offset as number,
						results: parseSearchRowsToMessages(query.offset as number, rows).reverse(),
					};
					resolve(response);
				}
			});
		});
	}

	canProvideMessages() {
		return this.isEnabled;
	}
}

// TODO: type any
function parseSearchRowsToMessages(id: number, rows: any[]) {
	const messages: Msg[] = [];

	for (const row of rows) {
		const msg = JSON.parse(row.msg);
		msg.time = row.time;
		msg.type = row.type;
		msg.networkUuid = row.network;
		msg.channelName = row.channel;
		msg.id = id;
		messages.push(new Msg(msg));
		id += 1;
	}

	return messages;
}

export default SqliteMessageStorage;
