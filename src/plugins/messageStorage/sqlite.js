"use strict";

const log = require("../../log");
const path = require("path");
const fs = require("fs");
const Helper = require("../../helper");
const Msg = require("../../models/msg");

let sqlite3;

try {
	sqlite3 = require("sqlite3");
} catch (e) {
	Helper.config.messageStorage = Helper.config.messageStorage.filter((item) => item !== "sqlite");

	log.error(
		"Unable to load node-sqlite3 module. See https://github.com/mapbox/node-sqlite3/wiki/Binaries"
	);
}

const currentSchemaVersion = 1520239200;

const schema = [
	// Tables
	"CREATE TABLE IF NOT EXISTS options (name TEXT, value TEXT, CONSTRAINT name_unique UNIQUE (name))",
	"CREATE TABLE IF NOT EXISTS channels (channel_id INTEGER PRIMARY KEY, network TEXT, channel TEXT, CONSTRAINT unique_channel UNIQUE (network, channel))",
	"CREATE TABLE IF NOT EXISTS messages (network TEXT, channel TEXT, time INTEGER, type TEXT, msg TEXT)",

	// Indexes
	"CREATE INDEX IF NOT EXISTS network_channel ON messages (network, channel)",
	"CREATE INDEX IF NOT EXISTS time ON messages (time)",
];

class MessageStorage {
	constructor(client) {
		this.client = client;
		this.isEnabled = false;
	}

	enable() {
		const logsPath = Helper.getUserLogsPath();
		const sqlitePath = path.join(logsPath, `${this.client.name}.sqlite3`);

		try {
			fs.mkdirSync(logsPath, {recursive: true});
		} catch (e) {
			log.error("Unable to create logs directory", e);

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
						return log.error(`Failed to retrieve schema version: ${err}`);
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

	close(callback) {
		if (!this.isEnabled) {
			return;
		}

		this.isEnabled = false;

		this.database.close((err) => {
			if (err) {
				log.error(`Failed to close sqlite database: ${err}`);
			}

			if (callback) {
				callback(err);
			}
		});
	}

	/**
	 * Store a new message in specified channel
	 *
	 * @param Network network - Network object where the channel is
	 * @param Chan channel - Channel object
	 * @param Msg msg - Message object to store
	 */
	index(network, channel, msg) {
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

	/**
	 * Delete stored all stored messages in a channel
	 *
	 * @param Network network - Network object where the channel is
	 * @param Chan channel - Channel object
	 */
	deleteChannel(network, channel) {
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
	 * Get the stored channel id, creates one if does not exist.
	 *
	 * @param Network network - Network object where the channel is
	 * @param Chan channel - Channel object
	 */
	getChannelId(network, channel) {
		if (!this.isEnabled) {
			return Promise.resolve(0);
		}

		const channelName = channel.name.toLowerCase();

		return new Promise((resolve, reject) => {
			this.database.serialize(() =>
				this.database.get(
					"SELECT channel_id FROM channels WHERE network = ? AND channel = ?",
					[network.uuid, channelName],
					(err, row) => {
						if (err) {
							return reject(err);
						}

						if (row) {
							return resolve(row.channel_id);
						}

						// This channel was not found, create it and "recursively" call getChannelId again
						this.database.serialize(() =>
							this.database.run(
								"INSERT INTO channels (network, channel) VALUES (?, ?)",
								[network.uuid, channelName],
								(err2) => {
									if (err2) {
										return reject(err2);
									}

									this.getChannelId(network, channel).then(resolve).catch(reject);
								}
							)
						);
					}
				)
			);
		});
	}

	/**
	 * Load messages for given channel on a given network and resolve a promise with loaded messages.
	 *
	 * @param Network network - Network object where the channel is
	 * @param Chan channel - Channel object for which to load messages for
	 */
	getMessages(network, channel) {
		if (!this.isEnabled || Helper.config.maxHistory === 0) {
			return Promise.resolve([]);
		}

		// If unlimited history is specified, load 100k messages
		const limit = Helper.config.maxHistory < 0 ? 100000 : Helper.config.maxHistory;

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
		});
	}

	canProvideMessages() {
		return this.isEnabled;
	}
}

module.exports = MessageStorage;
