import type {Database} from "sqlite3";

import log from "../../log";
import path from "path";
import fs from "fs/promises";
import Config from "../../config";
import Msg, {Message} from "../../models/msg";
import Chan, {Channel} from "../../models/chan";
import Helper from "../../helper";
import type {SearchResponse, SearchQuery, SearchableMessageStorage} from "./types";
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

class Deferred {
	resolve!: () => void;
	promise: Promise<void>;

	constructor() {
		this.promise = new Promise((resolve) => {
			this.resolve = resolve;
		});
	}
}

class SqliteMessageStorage implements SearchableMessageStorage {
	isEnabled: boolean;
	database!: Database;
	initDone: Deferred;
	userName: string;

	constructor(userName: string) {
		this.userName = userName;
		this.isEnabled = false;
		this.initDone = new Deferred();
	}

	async _enable() {
		const logsPath = Config.getUserLogsPath();
		const sqlitePath = path.join(logsPath, `${this.userName}.sqlite3`);

		try {
			await fs.mkdir(logsPath, {recursive: true});
		} catch (e) {
			throw Helper.catch_to_error("Unable to create logs directory", e);
		}

		this.isEnabled = true;

		this.database = new sqlite3.Database(sqlitePath);

		try {
			await this.run_migrations();
		} catch (e) {
			this.isEnabled = false;
			throw Helper.catch_to_error("Migration failed", e);
		}
	}

	async enable() {
		try {
			await this._enable();
		} finally {
			this.initDone.resolve(); // unblock the instance methods
		}
	}

	async run_migrations() {
		for (const stmt of schema) {
			await this.serialize_run(stmt, []);
		}

		const version = await this.serialize_get(
			"SELECT value FROM options WHERE name = 'schema_version'"
		);

		if (version === undefined) {
			// new table
			await this.serialize_run(
				"INSERT INTO options (name, value) VALUES ('schema_version', ?)",
				[currentSchemaVersion]
			);
			return;
		}

		const storedSchemaVersion = parseInt(version.value, 10);

		if (storedSchemaVersion === currentSchemaVersion) {
			return;
		}

		if (storedSchemaVersion > currentSchemaVersion) {
			throw `sqlite messages schema version is higher than expected (${storedSchemaVersion} > ${currentSchemaVersion}). Is The Lounge out of date?`;
		}

		log.info(
			`sqlite messages schema version is out of date (${storedSchemaVersion} < ${currentSchemaVersion}). Running migrations if any.`
		);

		await this.serialize_run("UPDATE options SET value = ? WHERE name = 'schema_version'", [
			currentSchemaVersion,
		]);
	}

	async close() {
		if (!this.isEnabled) {
			return;
		}

		this.isEnabled = false;

		return new Promise<void>((resolve, reject) => {
			this.database.close((err) => {
				if (err) {
					reject(`Failed to close sqlite database: ${err.message}`);
					return;
				}

				resolve();
			});
		});
	}

	async index(network: Network, channel: Chan, msg: Msg) {
		await this.initDone.promise;

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

		await this.serialize_run(
			"INSERT INTO messages(network, channel, time, type, msg) VALUES(?, ?, ?, ?, ?)",
			[
				network.uuid,
				channel.name.toLowerCase(),
				msg.time.getTime(),
				msg.type,
				JSON.stringify(clonedMsg),
			]
		);
	}

	async deleteChannel(network: Network, channel: Channel) {
		await this.initDone.promise;

		if (!this.isEnabled) {
			return;
		}

		await this.serialize_run("DELETE FROM messages WHERE network = ? AND channel = ?", [
			network.uuid,
			channel.name.toLowerCase(),
		]);
	}

	async getMessages(
		network: Network,
		channel: Channel,
		nextID: () => number
	): Promise<Message[]> {
		await this.initDone.promise;

		if (!this.isEnabled || Config.values.maxHistory === 0) {
			return [];
		}

		// If unlimited history is specified, load 100k messages
		const limit = Config.values.maxHistory < 0 ? 100000 : Config.values.maxHistory;

		const rows = await this.serialize_fetchall(
			"SELECT msg, type, time FROM messages WHERE network = ? AND channel = ? ORDER BY time DESC LIMIT ?",
			network.uuid,
			channel.name.toLowerCase(),
			limit
		);

		return rows.reverse().map((row: any): Message => {
			const msg = JSON.parse(row.msg);
			msg.time = row.time;
			msg.type = row.type;

			const newMsg = new Msg(msg);
			newMsg.id = nextID();

			return newMsg;
		});
	}

	async search(query: SearchQuery): Promise<SearchResponse> {
		await this.initDone.promise;

		if (!this.isEnabled) {
			// this should never be hit as messageProvider is checked in client.search()
			throw new Error(
				"search called but sqlite provider not enabled. This is a programming error"
			);
		}

		// Using the '@' character to escape '%' and '_' in patterns.
		const escapedSearchTerm = query.searchTerm.replace(/([%_@])/g, "@$1");

		let select =
			'SELECT msg, type, time, network, channel FROM messages WHERE type = "message" AND json_extract(msg, "$.text") LIKE ? ESCAPE \'@\'';
		const params: any[] = [`%${escapedSearchTerm}%`];

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
		params.push(maxResults);
		params.push(query.offset);

		const rows = await this.serialize_fetchall(select, ...params);
		return {
			...query,
			results: parseSearchRowsToMessages(query.offset, rows).reverse(),
		};
	}

	canProvideMessages() {
		return this.isEnabled;
	}

	private serialize_run(stmt: string, params: any[]): Promise<void> {
		return new Promise((resolve, reject) => {
			this.database.serialize(() => {
				this.database.run(stmt, params, (err) => {
					if (err) {
						reject(err);
						return;
					}

					resolve();
				});
			});
		});
	}

	private serialize_fetchall(stmt: string, ...params: any[]): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.database.serialize(() => {
				this.database.all(stmt, params, (err, rows) => {
					if (err) {
						reject(err);
						return;
					}

					resolve(rows);
				});
			});
		});
	}

	private serialize_get(stmt: string, ...params: any[]): Promise<any> {
		return new Promise((resolve, reject) => {
			this.database.serialize(() => {
				this.database.get(stmt, params, (err, row) => {
					if (err) {
						reject(err);
						return;
					}

					resolve(row);
				});
			});
		});
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
