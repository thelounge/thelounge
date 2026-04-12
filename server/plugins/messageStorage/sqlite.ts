import {DatabaseSync} from "node:sqlite";

import log from "../../log";
import path from "path";
import fs from "fs/promises";
import Config from "../../config";
import Msg, {Message} from "../../models/msg";
import Chan, {Channel} from "../../models/chan";
import Helper from "../../helper";
import type {SearchableMessageStorage, DeletionRequest} from "./types";
import Network from "../../models/network";
import {SearchQuery, SearchResponse} from "../../../shared/types/storage";

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

class SqliteMessageStorage implements SearchableMessageStorage {
	isEnabled: boolean;
	database!: DatabaseSync;
	initDone: Deferred;
	userName: string;

	constructor(userName: string) {
		this.userName = userName;
		this.isEnabled = false;
		this.initDone = new Deferred();
	}

	_enable(connection_string: string) {
		this.database = new DatabaseSync(connection_string);

		try {
			this.run_migrations();
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
			this._enable(sqlitePath);
		} finally {
			this.initDone.resolve(); // unblock the instance methods
		}
	}

	setup_new_db() {
		for (const stmt of schema) {
			this.database.exec(stmt);
		}

		this.database
			.prepare("INSERT INTO options (name, value) VALUES ('schema_version', ?)")
			.run(currentSchemaVersion.toString());
	}

	current_version(): number {
		const have_options = this.database
			.prepare("select 1 from sqlite_master where type = 'table' and name = 'options'")
			.get();

		if (!have_options) {
			return 0;
		}

		const version = this.database
			.prepare("SELECT value FROM options WHERE name = 'schema_version'")
			.get() as {value: string} | undefined;

		if (version === undefined) {
			// technically shouldn't happen, means something created a schema but didn't populate it
			// we'll try our best to recover
			return 0;
		}

		const storedSchemaVersion = parseInt(version.value, 10);
		return storedSchemaVersion;
	}

	update_version_in_db() {
		this.database
			.prepare("UPDATE options SET value = ? WHERE name = 'schema_version'")
			.run(currentSchemaVersion.toString());
	}

	_run_migrations(dbVersion: number) {
		log.info(
			`sqlite messages schema version is out of date (${dbVersion} < ${currentSchemaVersion}). Running migrations.`
		);

		const to_execute = necessaryMigrations(dbVersion);

		for (const stmt of to_execute.map((m) => m.stmts).flat()) {
			this.database.exec(stmt);
		}

		this.update_version_in_db();
	}

	run_migrations() {
		const version = this.current_version();

		if (version > currentSchemaVersion) {
			throw `sqlite messages schema version is higher than expected (${version} > ${currentSchemaVersion}). Is The Lounge out of date?`;
		} else if (version === currentSchemaVersion) {
			return; // nothing to do
		}

		this.database.exec("BEGIN EXCLUSIVE TRANSACTION");

		try {
			if (version === 0) {
				this.setup_new_db();
			} else {
				this._run_migrations(version);
			}

			this.insert_rollback_since(version);
		} catch (err) {
			this.database.exec("ROLLBACK");
			throw err;
		}

		this.database.exec("COMMIT");
		this.database.exec("VACUUM");
	}

	// helper method that vacuums the db, meant to be used by migration related cli commands
	vacuum() {
		this.database.exec("VACUUM");
	}

	close() {
		if (!this.isEnabled) {
			return;
		}

		this.isEnabled = false;
		this.database.close();
	}

	fetch_rollbacks(since_version: number): Rollback[] {
		const res = this.database
			.prepare(
				`select version, rollback_forbidden, statement
				from rollback_steps
				join migrations on migrations.id=rollback_steps.migration_id
				where version > ?
				order by version desc, step asc`
			)
			.all(since_version) as {
			version: number;
			rollback_forbidden: number;
			statement: string;
		}[];

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

	delete_migrations_older_than(version: number) {
		this.database.prepare("delete from migrations where migrations.version > ?").run(version);
	}

	_downgrade_to(version: number): number {
		const _rollbacks = this.fetch_rollbacks(version);

		if (_rollbacks.length === 0) {
			return version;
		}

		const forbidden = _rollbacks.find((item) => item.rollback_forbidden);

		if (forbidden) {
			throw Error(`can't downgrade past ${forbidden.version}`);
		}

		for (const rollback of _rollbacks) {
			for (const stmt of rollback.stmts) {
				this.database.exec(stmt);
			}
		}

		this.delete_migrations_older_than(version);
		this.update_version_in_db();

		return version;
	}

	downgrade_to(version: number): number {
		if (version <= 0) {
			throw Error(`${version} is not a valid version to downgrade to`);
		}

		this.database.exec("BEGIN EXCLUSIVE TRANSACTION");

		let new_version: number;

		try {
			new_version = this._downgrade_to(version);
		} catch (err) {
			this.database.exec("ROLLBACK");
			throw err;
		}

		this.database.exec("COMMIT");
		return new_version;
	}

	downgrade() {
		return this.downgrade_to(currentSchemaVersion);
	}

	insert_rollback_since(version: number) {
		const missing = newRollbacks(version);

		for (const rollback of missing) {
			const migration = this.database
				.prepare(
					`insert into migrations
					(version, rollback_forbidden)
					values (?, ?)
					returning id`
				)
				.get(rollback.version, rollback.rollback_forbidden ? 1 : 0) as {id: number};

			let step = 0;

			for (const stmt of rollback.stmts) {
				this.database
					.prepare(
						`insert into rollback_steps
						(migration_id, step, statement)
						values (?, ?, ?)`
					)
					.run(migration.id, step, stmt);
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

		this.database
			.prepare(
				"INSERT INTO messages(network, channel, time, type, msg) VALUES(?, ?, ?, ?, ?)"
			)
			.run(
				network.uuid,
				channel.name.toLowerCase(),
				msg.time.getTime(),
				msg.type,
				JSON.stringify(clonedMsg)
			);
	}

	async deleteChannel(network: Network, channel: Channel) {
		await this.initDone.promise;

		if (!this.isEnabled) {
			return;
		}

		this.database
			.prepare("DELETE FROM messages WHERE network = ? AND channel = ?")
			.run(network.uuid, channel.name.toLowerCase());
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

		const rows = this.database
			.prepare(
				"SELECT msg, type, time FROM messages WHERE network = ? AND channel = ? ORDER BY time DESC LIMIT ?"
			)
			.all(network.uuid, channel.name.toLowerCase(), limit) as {
			msg: string;
			type: string;
			time: number;
		}[];

		return rows.reverse().map((row): Message => {
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
			"SELECT msg, type, time, network, channel FROM messages WHERE type = 'message' AND json_extract(msg, '$.text') LIKE ? ESCAPE '@'";
		const params: (string | number)[] = [`%${escapedSearchTerm}%`];

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

		const rows = this.database.prepare(select).all(...params) as {
			msg: string;
			type: string;
			time: number;
			network: string;
			channel: string;
		}[];

		return {
			...query,
			results: parseSearchRowsToMessages(query.offset, rows).reverse(),
		};
	}

	async deleteMessages(req: DeletionRequest): Promise<number> {
		await this.initDone.promise;
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

		return this.database.prepare(sql).run().changes as number;
	}

	canProvideMessages() {
		return this.isEnabled;
	}
}

// TODO: type any
function parseSearchRowsToMessages(
	id: number,
	rows: {msg: string; type: string; time: number; network: string; channel: string}[]
) {
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
