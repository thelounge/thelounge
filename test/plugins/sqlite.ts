import fs from "fs";
import path from "path";
import {expect} from "chai";
import util from "../util.ts";
import Msg from "../../dist/server/models/msg.js";
import {MessageType} from "../../dist/shared/types/msg.js";
import Config from "../../dist/server/config.js";
import MessageStorage, {
	currentSchemaVersion,
	migrations,
	necessaryMigrations,
	rollbacks,
} from "../../dist/server/plugins/messageStorage/sqlite.js";
import Database from "better-sqlite3";
import type {DeletionRequest} from "../../server/plugins/messageStorage/types.js";

const orig_schema = [
	// Schema version #1
	// DO NOT CHANGE THIS IN ANY WAY, it's needed to properly test migrations
	"CREATE TABLE IF NOT EXISTS options (name TEXT, value TEXT, CONSTRAINT name_unique UNIQUE (name))",
	"CREATE TABLE IF NOT EXISTS messages (network TEXT, channel TEXT, time INTEGER, type TEXT, msg TEXT)",
	"CREATE INDEX IF NOT EXISTS network_channel ON messages (network, channel)",
	"CREATE INDEX IF NOT EXISTS time ON messages (time)",
];

const v1_schema_version = 1520239200;

const v1_dummy_messages = [
	{
		network: "8f650427-79a2-4950-b8af-94088b61b37c",
		channel: "##linux",
		time: 1594845354280,
		type: "message",
		msg: '{"from":{"mode":"","nick":"rascul"},"text":"db on a flash drive doesn\'t sound very nice though","self":false,"highlight":false,"users":[]}',
	},
	{
		network: "8f650427-79a2-4950-b8af-94088b61b37c",
		channel: "##linux",
		time: 1594845357234,
		type: "message",
		msg: '{"from":{"mode":"","nick":"GrandPa-G"},"text":"that\'s the point of changing to make sure.","self":false,"highlight":false,"users":[]}',
	},
	{
		network: "8f650427-79a2-4950-b8af-94088b61b37c",
		channel: "#pleroma-dev",
		time: 1594845358464,
		type: "message",
		msg: '{"from":{"mode":"@","nick":"rinpatch"},"text":"it\'s complicated","self":false,"highlight":false,"users":[]}',
	},
];

describe("SQLite migrations", function () {
	let db: Database.Database;

	function serialize_run(stmt: string, ...params: any[]): Promise<void> {
		try {
			db.prepare(stmt).run(...params);
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}

	before(async function () {
		db = new Database(":memory:");

		for (const stmt of orig_schema) {
			await serialize_run(stmt);
		}

		for (const msg of v1_dummy_messages) {
			await serialize_run(
				"INSERT INTO messages(network, channel, time, type, msg) VALUES(?, ?, ?, ?, ?)",
				msg.network,
				msg.channel,
				msg.time,
				msg.type,
				msg.msg
			);
		}
	});

	after(function () {
		db.close();
	});

	it("has a down migration for every migration", function () {
		expect(migrations.length).to.eq(rollbacks.length);
		expect(migrations.map((m) => m.version)).to.have.ordered.members(
			rollbacks.map((r) => r.version)
		);
	});

	it("has working up-migrations", async function () {
		const to_execute = necessaryMigrations(v1_schema_version);
		expect(to_execute.length).to.eq(migrations.length);
		await serialize_run("BEGIN EXCLUSIVE TRANSACTION");

		for (const stmt of to_execute.map((m) => m.stmts).flat()) {
			await serialize_run(stmt);
		}

		await serialize_run("COMMIT TRANSACTION");
	});

	it("has working down-migrations", async function () {
		await serialize_run("BEGIN EXCLUSIVE TRANSACTION");

		for (const rollback of rollbacks.slice().reverse()) {
			if (rollback.rollback_forbidden) {
				throw Error(
					"Try to write a down migration, if you really can't, flip this to a break"
				);
			}

			for (const stmt of rollback.stmts) {
				await serialize_run(stmt);
			}
		}

		await serialize_run("COMMIT TRANSACTION");
	});
});

describe("SQLite unit tests", function () {
	let store: MessageStorage;

	beforeEach(async function () {
		store = new MessageStorage("testUser");
		await store._enable(":memory:");
		store.initDone.resolve();
	});

	afterEach(async function () {
		await store.close();
	});

	it("deletes messages when asked to", async function () {
		const baseDate = new Date();

		const net = {uuid: "testnet"} as any;
		const chan = {name: "#channel"} as any;

		for (let i = 0; i < 14; ++i) {
			await store.index(
				net,
				chan,
				new Msg({
					time: dateAddDays(baseDate, -i),
					text: `msg ${i}`,
				})
			);
		}

		const limit = 1;
		const delReq: DeletionRequest = {
			messageTypes: [MessageType.MESSAGE],
			limit: limit,
			olderThanDays: 2,
		};

		let deleted = await store.deleteMessages(delReq);
		expect(deleted).to.equal(limit, "number of deleted messages doesn't match");

		let id = 0;
		let messages = await store.getMessages(net, chan, () => id++);
		expect(messages.find((m) => m.text === "msg 13")).to.be.undefined; // oldest gets deleted first

		// let's test if it properly cleans now
		delReq.limit = 100;
		deleted = await store.deleteMessages(delReq);
		expect(deleted).to.equal(11, "number of deleted messages doesn't match");
		messages = await store.getMessages(net, chan, () => id++);
		expect(messages.map((m) => m.text)).to.have.ordered.members(["msg 1", "msg 0"]);
	});

	it("deletes only the types it should", async function () {
		const baseDate = new Date();

		const net = {uuid: "testnet"} as any;
		const chan = {name: "#channel"} as any;

		for (let i = 0; i < 6; ++i) {
			await store.index(
				net,
				chan,
				new Msg({
					time: dateAddDays(baseDate, -i),
					text: `msg ${i}`,
					type: [
						MessageType.ACTION,
						MessageType.AWAY,
						MessageType.JOIN,
						MessageType.PART,
						MessageType.KICK,
						MessageType.MESSAGE,
					][i],
				})
			);
		}

		const delReq: DeletionRequest = {
			messageTypes: [MessageType.ACTION, MessageType.JOIN, MessageType.KICK],
			limit: 100, // effectively no limit
			olderThanDays: 0,
		};

		let deleted = await store.deleteMessages(delReq);
		expect(deleted).to.equal(3, "number of deleted messages doesn't match");

		let id = 0;
		let messages = await store.getMessages(net, chan, () => id++);
		expect(messages.map((m) => m.type)).to.have.ordered.members([
			MessageType.MESSAGE,
			MessageType.PART,
			MessageType.AWAY,
		]);

		delReq.messageTypes = [
			MessageType.JOIN, // this is not in the remaining set, just here as a dummy
			MessageType.PART,
			MessageType.MESSAGE,
		];
		deleted = await store.deleteMessages(delReq);
		expect(deleted).to.equal(2, "number of deleted messages doesn't match");
		messages = await store.getMessages(net, chan, () => id++);
		expect(messages.map((m) => m.type)).to.have.ordered.members([MessageType.AWAY]);
	});
});

describe("SQLite Message Storage", function () {
	// Increase timeout due to unpredictable I/O on CI services
	this.timeout(util.isRunningOnCI() ? 25000 : 5000);
	this.slow(300);

	const expectedPath = path.join(Config.getHomePath(), "logs", "testUser.sqlite3");
	let store: MessageStorage;

	function db_get_one(stmt: string, ...params: any[]): Promise<any> {
		try {
			const row = store.database.prepare(stmt).get(...params);
			return Promise.resolve(row);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	function db_get_mult(stmt: string, ...params: any[]): Promise<any[]> {
		try {
			const rows = store.database.prepare(stmt).all(...params);
			return Promise.resolve(rows);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	before(function (done) {
		store = new MessageStorage("testUser");

		// Delete database file from previous test run
		if (fs.existsSync(expectedPath)) {
			fs.unlink(expectedPath, done);
		} else {
			done();
		}
	});

	after(function (done) {
		// After tests run, remove the logs folder
		// so we return to the clean state
		fs.unlinkSync(expectedPath);
		fs.rmdir(path.join(Config.getHomePath(), "logs"), done);
	});

	it("should create database file", async function () {
		expect(store.isEnabled).to.be.false;
		expect(fs.existsSync(expectedPath)).to.be.false;

		await store.enable();
		expect(store.isEnabled).to.be.true;
	});

	it("should resolve an empty array when disabled", async function () {
		store.isEnabled = false;
		const messages = await store.getMessages(null as any, null as any, null as any);
		expect(messages).to.be.empty;
		store.isEnabled = true;
	});

	it("should insert schema version to options table", async function () {
		const row = await db_get_one("SELECT value FROM options WHERE name = 'schema_version'");
		expect(row.value).to.equal(currentSchemaVersion.toString());
	});

	it("should insert migrations", async function () {
		const row = await db_get_one(
			"SELECT id, version FROM migrations WHERE version = ?",
			currentSchemaVersion
		);
		expect(row).to.not.be.undefined;
	});

	it("should store a message", async function () {
		await store.index(
			{
				uuid: "this-is-a-network-guid",
			} as any,
			{
				name: "#thisISaCHANNEL",
			} as any,
			new Msg({
				time: 123456789,
				text: "Hello from sqlite world!",
			} as any)
		);
	});

	it("should retrieve previously stored message", async function () {
		let msgid = 0;
		const messages = await store.getMessages(
			{
				uuid: "this-is-a-network-guid",
			} as any,
			{
				name: "#thisisaCHANNEL",
			} as any,
			() => msgid++
		);
		expect(messages).to.have.lengthOf(1);
		const msg = messages[0];
		expect(msg.text).to.equal("Hello from sqlite world!");
		expect(msg.type).to.equal(MessageType.MESSAGE);
		expect(msg.time.getTime()).to.equal(123456789);
	});

	it("should retrieve latest LIMIT messages in order", async function () {
		const originalMaxHistory = Config.values.maxHistory;

		try {
			Config.values.maxHistory = 2;

			for (let i = 0; i < 200; ++i) {
				await store.index(
					{uuid: "retrieval-order-test-network"} as any,
					{name: "#channel"} as any,
					new Msg({
						time: 123456789 + i,
						text: `msg ${i}`,
					} as any)
				);
			}

			let msgId = 0;
			const messages = await store.getMessages(
				{uuid: "retrieval-order-test-network"} as any,
				{name: "#channel"} as any,
				() => msgId++
			);
			expect(messages).to.have.lengthOf(2);
			expect(messages.map((i_1) => i_1.text)).to.deep.equal(["msg 198", "msg 199"]);
		} finally {
			Config.values.maxHistory = originalMaxHistory;
		}
	});

	it("should search messages", async function () {
		const originalMaxHistory = Config.values.maxHistory;

		try {
			Config.values.maxHistory = 2;

			const search = await store.search({
				searchTerm: "msg",
				networkUuid: "retrieval-order-test-network",
				channelName: "",
				offset: 0,
			});
			expect(search.results).to.have.lengthOf(100);
			const expectedMessages: string[] = [];

			for (let i = 100; i < 200; ++i) {
				expectedMessages.push(`msg ${i}`);
			}

			expect(search.results.map((i_1) => i_1.text)).to.deep.equal(expectedMessages);
		} finally {
			Config.values.maxHistory = originalMaxHistory;
		}
	});

	it("should search messages with escaped wildcards", async function () {
		async function assertResults(query: string, expected: string[]) {
			const search = await store.search({
				searchTerm: query,
				networkUuid: "this-is-a-network-guid2",
				channelName: "",
				offset: 0,
			});
			expect(search.results.map((i) => i.text)).to.deep.equal(expected);
		}

		const originalMaxHistory = Config.values.maxHistory;

		try {
			Config.values.maxHistory = 3;

			await store.index(
				{uuid: "this-is-a-network-guid2"} as any,
				{name: "#channel"} as any,
				new Msg({
					time: 123456790,
					text: `foo % bar _ baz`,
				} as any)
			);

			await store.index(
				{uuid: "this-is-a-network-guid2"} as any,
				{name: "#channel"} as any,
				new Msg({
					time: 123456791,
					text: `foo bar x baz`,
				} as any)
			);

			await store.index(
				{uuid: "this-is-a-network-guid2"} as any,
				{name: "#channel"} as any,
				new Msg({
					time: 123456792,
					text: `bar @ baz`,
				} as any)
			);

			await assertResults("foo", ["foo % bar _ baz", "foo bar x baz"]);
			await assertResults("%", ["foo % bar _ baz"]);
			await assertResults("foo % bar ", ["foo % bar _ baz"]);
			await assertResults("_", ["foo % bar _ baz"]);
			await assertResults("bar _ baz", ["foo % bar _ baz"]);
			await assertResults("%%", []);
			await assertResults("@%", []);
			await assertResults("@", ["bar @ baz"]);
		} finally {
			Config.values.maxHistory = originalMaxHistory;
		}
	});

	it("should be able to downgrade", async function () {
		for (const rollback of rollbacks.slice().reverse()) {
			if (rollback.rollback_forbidden) {
				throw Error(
					"Try to write a down migration, if you really can't, flip this to a break"
				);
			}

			const new_version = await store.downgrade_to(rollback.version);
			expect(new_version).to.equal(rollback.version);
		}
	});

	it("should close database", async function () {
		await store.close();
		expect(fs.existsSync(expectedPath)).to.be.true;
	});
});

function dateAddDays(date: Date, days: number) {
	const ret = new Date(date.valueOf());
	ret.setDate(date.getDate() + days);
	return ret;
}
