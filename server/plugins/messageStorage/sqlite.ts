import Database from "better-sqlite3";

import log from "../../log.js";
import path from "path";
import fs from "fs/promises";
import Config from "../../config.js";
import Msg, {Message} from "../../models/msg.js";
import Chan, {Channel} from "../../models/chan.js";
import Helper from "../../helper.js";
import type {SearchableMessageStorage, DeletionRequest} from "./types.js";
import Network from "../../models/network.js";
import {SearchQuery, SearchResponse} from "../../../shared/types/storage.js";

type Migration = {version: number; stmts: string[]};
type Rollback = {version: number; rollback_forbidden?: boolean; stmts: string[]};

export const currentSchemaVersion = 1703322560448; // use `new Date().getTime()`

// Desired schema, adapt to the newest version and add migrations to the array below
const schema = [
	"CREATE TABLE options (name TEXT, value TEXT, CONSTRAINT name_unique UNIQUE (name))",
	"CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, network TEXT, channel TEXT, time INTEGER, type TEXT, msg TEXT)",
	`CREATE TABLE migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER NOT NULL UNIQUE,
        rollback_forbidden INTEGER DEFAULT 0 NOT NULL
    )`,
	`CREATE TABLE rollback_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        migration_id INTEGER NOT NULL REFERENCES migrations ON DELETE CASCADE,
        step INTEGER NOT NULL,
        statement TEXT NOT NULL
    )`,
	"CREATE INDEX network_channel ON messages (network, channel)",
	"CREATE INDEX time ON messages (time)",
	"CREATE INDEX msg_type_idx on messages (type)", // needed for efficient storageCleaner queries
];

// the migrations will be executed in an exclusive transaction as a whole
// add new migrations to the end, with the version being the new 'currentSchemaVersion'
// write a corresponding down migration into rollbacks
export const migrations: Migration[] = [
	{
		version: 1672236339873,
		stmts: [
			"CREATE TABLE messages_new (id INTEGER PRIMARY KEY AUTOINCREMENT, network TEXT, channel TEXT, time INTEGER, type TEXT, msg TEXT)",
			"INSERT INTO messages_new(network, channel, time, type, msg) select network, channel, time, type, msg from messages order by time asc",
			"DROP TABLE messages",
			"ALTER TABLE messages_new RENAME TO messages",
			"CREATE INDEX network_channel ON messages (network, channel)",
			"CREATE INDEX time ON messages (time)",
		],
	},
	{
		version: 1679743888000,
		stmts: [
			`CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                version INTEGER NOT NULL UNIQUE,
                rollback_forbidden INTEGER DEFAULT 0 NOT NULL
            )`,
			`CREATE TABLE IF NOT EXISTS rollback_steps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                migration_id INTEGER NOT NULL REFERENCES migrations ON DELETE CASCADE,
                step INTEGER NOT NULL,
                statement TEXT NOT NULL
            )`,
		],
	},
	{
		version: 1703322560448,
		stmts: ["CREATE INDEX msg_type_idx on messages (type)"],
	},
];

// down migrations need to restore the state of the prior version.
// rollback can be disallowed by adding rollback_forbidden: true to it
export const rollbacks: Rollback[] = [
	{
		version: 1672236339873,
		stmts: [], // changes aren't visible, left empty on purpose
	},
	{
		version: 1679743888000,
		stmts: [], // here we can't drop the tables, as we use them in the code, so just leave those in
	},
	{
		version: 1703322560448,
		stmts: ["drop INDEX msg_type_idx"],
	},
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

type BatchedMessage = {
	network: string;
	channel: string;
	time: number;
	type: string;
	msg: string;
};

class SqliteMessageStorage implements SearchableMessageStorage {
	isEnabled: boolean;
	database!: Database.Database;
	initDone: Deferred;
	userName: string;

	// Message batching for improved write performance
	private batchQueue: BatchedMessage[] = [];
	private batchSize = 50; // Flush after 50 messages
	private batchTimeout = 1000; // Flush after 1 second
	private batchTimer: NodeJS.Timeout | null = null;
	private insertStmt: Database.Statement | null = null;

	constructor(userName: string) {
		this.userName = userName;
		this.isEnabled = false;
		this.initDone = new Deferred();
	}

	async _enable(connection_string: string) {
		try {
			this.database = new Database(connection_string);
			await this.run_pragmas(); // must be done outside of a transaction
			await this.run_migrations();

			// Prepare insert statement for batching
			this.insertStmt = this.database.prepare(
				"INSERT INTO messages(network, channel, time, type, msg) VALUES(?, ?, ?, ?, ?)"
			);
		} catch (e) {
			this.isEnabled = false;
			throw Helper.catch_to_error("Migration failed", e);
		}

		this.isEnabled = true;
	}

	async enable() {
		const logsPath = Config.getUserLogsPath();
		const sqlitePath = path.join(logsPath, `${this.userName}.sqlite3`);

		try {
			await fs.mkdir(logsPath, {recursive: true});
		} catch (e) {
			throw Helper.catch_to_error("Unable to create logs directory", e);
		}

		try {
			await this._enable(sqlitePath);
		} finally {
			this.initDone.resolve(); // unblock the instance methods
		}
	}

	async setup_new_db() {
		for (const stmt of schema) {
			await this.serialize_run(stmt);
		}

		await this.serialize_run(
			"INSERT INTO options (name, value) VALUES ('schema_version', ?)",
			currentSchemaVersion.toString()
		);
	}

	async current_version(): Promise<number> {
		const have_options = await this.serialize_get(
			"select 1 from sqlite_master where type = 'table' and name = 'options'"
		);

		if (!have_options) {
			return 0;
		}

		const version = await this.serialize_get(
			"SELECT value FROM options WHERE name = 'schema_version'"
		);

		if (version === undefined) {
			// technically shouldn't happen, means something created a schema but didn't populate it
			// we'll try our best to recover
			return 0;
		}

		const storedSchemaVersion = parseInt(version.value, 10);
		return storedSchemaVersion;
	}

	async update_version_in_db() {
		return this.serialize_run(
			"UPDATE options SET value = ? WHERE name = 'schema_version'",
			currentSchemaVersion.toString()
		);
	}

	async _run_migrations(dbVersion: number) {
		log.info(
			`sqlite messages schema version is out of date (${dbVersion} < ${currentSchemaVersion}). Running migrations.`
		);

		const to_execute = necessaryMigrations(dbVersion);

		for (const stmt of to_execute.map((m) => m.stmts).flat()) {
			await this.serialize_run(stmt);
		}

		await this.update_version_in_db();
	}

	async run_pragmas() {
		await this.serialize_run("PRAGMA foreign_keys = ON;");
	}

	async run_migrations() {
		const version = await this.current_version();

		if (version > currentSchemaVersion) {
			throw `sqlite messages schema version is higher than expected (${version} > ${currentSchemaVersion}). Is NexusIRC out of date?`;
		} else if (version === currentSchemaVersion) {
			return; // nothing to do
		}

		await this.serialize_run("BEGIN EXCLUSIVE TRANSACTION");

		try {
			if (version === 0) {
				await this.setup_new_db();
			} else {
				await this._run_migrations(version);
			}

			await this.insert_rollback_since(version);
		} catch (err) {
			await this.serialize_run("ROLLBACK");
			throw err;
		}

		await this.serialize_run("COMMIT");
		await this.serialize_run("VACUUM");
	}

	// helper method that vacuums the db, meant to be used by migration related cli commands
	async vacuum() {
		await this.serialize_run("VACUUM");
	}

	async close() {
		if (!this.isEnabled) {
			return;
		}

		// Flush any pending batched messages
		await this.flushBatch();

		// Clear batch timer
		if (this.batchTimer) {
			clearTimeout(this.batchTimer);
			this.batchTimer = null;
		}

		this.isEnabled = false;

		try {
			this.database.close();
		} catch (err: any) {
			throw new Error(`Failed to close sqlite database: ${err.message}`);
		}
	}

	/**
	 * Flush batched messages to database using a transaction
	 */
	private async flushBatch(): Promise<void> {
		if (this.batchQueue.length === 0) {
			return;
		}

		if (!this.insertStmt) {
			log.error("Cannot flush batch: insert statement not prepared");
			return;
		}

		const messages = this.batchQueue.splice(0); // Take all messages and clear queue

		try {
			// Use transaction for batch insert (much faster than individual inserts)
			const transaction = this.database.transaction((msgs: BatchedMessage[]) => {
				for (const msg of msgs) {
					this.insertStmt!.run(msg.network, msg.channel, msg.time, msg.type, msg.msg);
				}
			});

			transaction(messages);
		} catch (err) {
			log.error(`Failed to flush message batch: ${err}`);
			// Re-add messages to queue on failure
			this.batchQueue.unshift(...messages);
			throw err;
		}
	}

	/**
	 * Schedule a batch flush
	 */
	private scheduleBatchFlush(): void {
		if (this.batchTimer) {
			return; // Timer already scheduled
		}

		this.batchTimer = setTimeout(() => {
			this.batchTimer = null;
			this.flushBatch().catch((err) => log.error(`Batch flush error: ${err}`));
		}, this.batchTimeout);
	}

	async fetch_rollbacks(since_version: number) {
		const res = await this.serialize_fetchall(
			`select version, rollback_forbidden, statement
            from rollback_steps
            join migrations on migrations.id=rollback_steps.migration_id
            where version > ?
            order by version desc, step asc`,
			since_version
		);
		const result: Rollback[] = [];

		// convert to Rollback[]
		// requires ordering in the sql statement
		for (const raw of res) {
			const last = result.at(-1);

			if (!last || raw.version !== last.version) {
				result.push({
					version: raw.version,
					rollback_forbidden: Boolean(raw.rollback_forbidden),
					stmts: [raw.statement],
				});
			} else {
				last.stmts.push(raw.statement);
			}
		}

		return result;
	}

	async delete_migrations_older_than(version: number) {
		return this.serialize_run("delete from migrations where migrations.version > ?", version);
	}

	async _downgrade_to(version: number) {
		const _rollbacks = await this.fetch_rollbacks(version);

		if (_rollbacks.length === 0) {
			return version;
		}

		const forbidden = _rollbacks.find((item) => item.rollback_forbidden);

		if (forbidden) {
			throw Error(`can't downgrade past ${forbidden.version}`);
		}

		for (const rollback of _rollbacks) {
			for (const stmt of rollback.stmts) {
				await this.serialize_run(stmt);
			}
		}

		await this.delete_migrations_older_than(version);
		await this.update_version_in_db();

		return version;
	}

	async downgrade_to(version: number) {
		if (version <= 0) {
			throw Error(`${version} is not a valid version to downgrade to`);
		}

		await this.serialize_run("BEGIN EXCLUSIVE TRANSACTION");

		let new_version: number;

		try {
			new_version = await this._downgrade_to(version);
		} catch (err) {
			await this.serialize_run("ROLLBACK");
			throw err;
		}

		await this.serialize_run("COMMIT");
		return new_version;
	}

	async downgrade() {
		const res = await this.downgrade_to(currentSchemaVersion);
		return res;
	}

	async insert_rollback_since(version: number) {
		const missing = newRollbacks(version);

		for (const rollback of missing) {
			const migration = await this.serialize_get(
				`insert into migrations
                (version, rollback_forbidden)
                values (?, ?)
                returning id`,
				rollback.version,
				rollback.rollback_forbidden || 0
			);

			for (const stmt of rollback.stmts) {
				let step = 0;
				await this.serialize_run(
					`insert into rollback_steps
                    (migration_id, step, statement)
                    values (?, ?, ?)`,
					migration.id,
					step,
					stmt
				);
				step++;
			}
		}
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

		// Add to batch queue instead of immediate insert
		this.batchQueue.push({
			network: network.uuid,
			channel: channel.name.toLowerCase(),
			time: msg.time.getTime(),
			type: msg.type,
			msg: JSON.stringify(clonedMsg),
		});

		// Flush batch if it reaches the size limit
		if (this.batchQueue.length >= this.batchSize) {
			await this.flushBatch();
		} else {
			// Schedule flush after timeout
			this.scheduleBatchFlush();
		}
	}

	async deleteChannel(network: Network, channel: Channel) {
		await this.initDone.promise;

		if (!this.isEnabled) {
			return;
		}

		await this.serialize_run(
			"DELETE FROM messages WHERE network = ? AND channel = ?",
			network.uuid,
			channel.name.toLowerCase()
		);
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

		// Flush any pending batched writes before reading
		await this.flushBatch();

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

		// Flush any pending batched writes before searching
		await this.flushBatch();

		// Using the '@' character to escape '%' and '_' in patterns.
		const escapedSearchTerm = query.searchTerm.replace(/([%_@])/g, "@$1");

		let select =
			"SELECT msg, type, time, network, channel FROM messages WHERE type = 'message' AND json_extract(msg, '$.text') LIKE ? ESCAPE '@'";
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

	async deleteMessages(req: DeletionRequest): Promise<number> {
		await this.initDone.promise;

		// Flush any pending batched writes before deleting
		await this.flushBatch();

		let sql = "delete from messages where id in (select id from messages where\n";

		// We roughly get a timestamp from N days before.
		// We don't adjust for daylight savings time or other weird time jumps
		const millisecondsInDay = 24 * 60 * 60 * 1000;
		const deleteBefore = Date.now() - req.olderThanDays * millisecondsInDay;
		sql += `time <= ${deleteBefore}\n`;

		let typeClause = "";

		if (req.messageTypes !== null) {
			typeClause = `type in (${req.messageTypes.map((type) => `'${type}'`).join(",")})\n`;
		}

		if (typeClause) {
			sql += `and ${typeClause}`;
		}

		sql += "order by time asc\n";
		sql += `limit ${req.limit}\n`;
		sql += ")";

		return this.serialize_run(sql);
	}

	/**
	 * Get last N messages for a channel (for initial load)
	 */
	async getLastMessages(
		networkUuid: string,
		channelName: string,
		limit: number
	): Promise<Message[]> {
		await this.initDone.promise;

		if (!this.isEnabled) {
			return [];
		}

		// Flush any pending batched writes before reading
		await this.flushBatch();

		const rows = await this.serialize_fetchall(
			"SELECT msg, type, time FROM messages WHERE network = ? AND channel = ? ORDER BY time DESC LIMIT ?",
			networkUuid,
			channelName.toLowerCase(),
			limit
		);

		return rows.reverse().map((row: any): Message => {
			const msg = JSON.parse(row.msg);
			msg.time = row.time;
			msg.type = row.type;
			return new Msg(msg);
		});
	}

	/**
	 * Get messages before a specific timestamp (for lazy loading)
	 */
	async getMessagesBefore(
		networkUuid: string,
		channelName: string,
		beforeTime: number,
		limit: number
	): Promise<Message[]> {
		await this.initDone.promise;

		if (!this.isEnabled) {
			return [];
		}

		const rows = await this.serialize_fetchall(
			"SELECT msg, type, time FROM messages WHERE network = ? AND channel = ? AND time < ? ORDER BY time DESC LIMIT ?",
			networkUuid,
			channelName.toLowerCase(),
			beforeTime,
			limit
		);

		return rows.reverse().map((row: any): Message => {
			const msg = JSON.parse(row.msg);
			msg.time = row.time;
			msg.type = row.type;
			return new Msg(msg);
		});
	}

	/**
	 * Get total message count for a channel
	 */
	async getMessageCount(networkUuid: string, channelName: string): Promise<number> {
		await this.initDone.promise;

		if (!this.isEnabled) {
			return 0;
		}

		const row = await this.serialize_get(
			"SELECT COUNT(*) as count FROM messages WHERE network = ? AND channel = ?",
			networkUuid,
			channelName.toLowerCase()
		);

		return row ? (row.count as number) : 0;
	}

	canProvideMessages() {
		return this.isEnabled;
	}

	private serialize_run(stmt: string, ...params: any[]): Promise<number> {
		try {
			const result = this.database.prepare(stmt).run(...params);
			return Promise.resolve(result.changes);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	private serialize_fetchall(stmt: string, ...params: any[]): Promise<any[]> {
		try {
			const rows = this.database.prepare(stmt).all(...params);
			return Promise.resolve(rows);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	private serialize_get(stmt: string, ...params: any[]): Promise<any> {
		try {
			const row = this.database.prepare(stmt).get(...params);
			return Promise.resolve(row);
		} catch (err) {
			return Promise.reject(err);
		}
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

export function necessaryMigrations(since: number): Migration[] {
	return migrations.filter((m) => m.version > since);
}

export function newRollbacks(since: number): Rollback[] {
	return rollbacks.filter((r) => r.version > since);
}

export default SqliteMessageStorage;
