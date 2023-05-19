/* eslint-disable @typescript-eslint/no-unsafe-return */
import _ from "lodash";
import fs from "fs/promises";
import path from "path";
import {expect} from "chai";
import util from "../util";
import Msg, {MessageType} from "../../server/models/msg";
import Config from "../../server/config";
import MessageStorage from "../../server/plugins/messageStorage/sqlite";

async function exists(filePath: string) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function cleanup() {
	const dirpath = path.join(Config.getHomePath(), "logs");

	if (await exists(dirpath)) {
		await fs.rm(dirpath, {recursive: true});
	}
}

describe("SQLite Message Storage (stateful tests)", function () {
	// Increase timeout due to unpredictable I/O on CI services
	this.timeout(util.isRunningOnCI() ? 25000 : 5000);
	this.slow(300);

	const expectedPath = path.join(Config.getHomePath(), "logs", "testUser.sqlite3");
	let store: MessageStorage;

	before(async function () {
		// Delete database file from previous test run
		await cleanup();

		store = new MessageStorage("testUser", undefined as any);
	});

	after(async function () {
		// After tests run, remove the logs folder
		// so we return to the clean state
		await cleanup();
	});

	it("should create database file", async function () {
		expect(store.isEnabled).to.be.false;
		expect(await exists(expectedPath)).to.be.false;

		await store.enable();
		expect(store.isEnabled).to.be.true;
	});

	it("should resolve an empty array when disabled", async function () {
		store.isEnabled = false;
		const messages = await store.getMessages(null as any, null as any, null as any);
		expect(messages).to.be.empty;
		store.isEnabled = true;
	});

	it("should create tables", function (done) {
		store.database.all(
			"SELECT name, tbl_name, sql FROM sqlite_master WHERE type = 'table'",
			(err, row) => {
				expect(err).to.be.null;
				expect(row).to.deep.equal([
					{
						name: "options",
						tbl_name: "options",
						sql: "CREATE TABLE options (name TEXT, value TEXT, CONSTRAINT name_unique UNIQUE (name))",
					},
					{
						name: "messages",
						tbl_name: "messages",
						sql: "CREATE TABLE messages (network TEXT, channel TEXT, time INTEGER, type TEXT, msg TEXT)",
					},
				]);

				done();
			}
		);
	});

	it("should insert schema version to options table", function (done) {
		store.database.get(
			"SELECT value FROM options WHERE name = 'schema_version'",
			(err, row: {value: string}) => {
				expect(err).to.be.null;

				// Should be sqlite.currentSchemaVersion,
				// compared as string because it's returned as such from the database
				expect(row.value).to.equal("1520239200");

				done();
			}
		);
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

	it("should close database", async function () {
		await store.close();
		expect(await exists(expectedPath)).to.be.true;
	});
});

describe("SQLite Message Storage (stateless tests)", function () {
	// Increase timeout due to unpredictable I/O on CI services
	this.timeout(util.isRunningOnCI() ? 25000 : 5000);
	this.slow(300);

	let store: MessageStorage;
	beforeEach(async function () {
		await cleanup();
	});

	afterEach(async function () {
		await store.close();
		await cleanup();
	});

	it("Should not schedule pruning because of server and client settings", async function () {
		const originalMaxDays = Config.values?.sqliteConfig?.maxDaysHistory;
		_.set(Config.values, "sqliteConfig.maxDaysHistory", undefined);

		store = new MessageStorage("testUser", {maxDaysHistory: 0});
		await store.enable();
		expect(store.scheduledIntervalId).to.be.undefined;

		_.set(Config.values, "sqliteConfig.maxDaysHistory", originalMaxDays);
	});

	it("Should schedule pruning because of client settings", async function () {
		const originalMaxDays = Config.values?.sqliteConfig?.maxDaysHistory;

		_.set(Config.values, "sqliteConfig.maxDaysHistory", undefined);
		store = new MessageStorage("testUser", {maxDaysHistory: 1});
		await store.enable();
		expect(store.scheduledIntervalId).to.not.be.undefined;

		_.set(Config.values, "sqliteConfig.maxDaysHistory", originalMaxDays);
	});

	it("Should schedule pruning because of server settings", async function () {
		const originalMaxDays = Config.values?.sqliteConfig?.maxDaysHistory;

		_.set(Config.values, "sqliteConfig.maxDaysHistory", 1);
		store = new MessageStorage("testUser", {maxDaysHistory: 0});
		await store.enable();
		expect(store.scheduledIntervalId).to.not.be.undefined;

		_.set(Config.values, "sqliteConfig.maxDaysHistory", originalMaxDays);
	});

	it("Should only prune old messages", async function () {
		store = new MessageStorage("testUser", undefined);
		await store.enable();

		const dayInMs = 24 * 60 * 60 * 1000;
		const now = Date.now();

		const network = {uuid: "network-guid"};
		const chan = {name: "#channel"};

		// First insert lots of messages.
		for (let i = 0; i < 100; ++i) {
			// Each event is 1 day older
			await store.index(
				network as any,
				chan as any,
				new Msg({
					time: new Date(now - i * dayInMs),
					text: `${i}`,
				})
			);
		}

		let msgid = 0;
		let messages = await store.getMessages(network as any, chan as any, () => msgid++);
		expect(messages).to.have.length(100);

		// Delete events older than 90 days but limit to only 1 event
		await store.pruneOldEvents(90, 1);

		messages = await store.getMessages(network as any, chan as any, () => msgid++);
		expect(messages).to.have.length(99);
		// make sure the oldest event (text = 99) was deleted
		const found_msgs = new Set(messages.map((msg) => msg.text));
		expect(found_msgs.has("99")).to.be.false;

		// Delete events older than 90 days
		await store.pruneOldEvents(90, 1000);
		messages = await store.getMessages(network as any, chan as any, () => msgid++);
		expect(messages).to.have.length(90);

		// Delete events older than 1 day
		await store.pruneOldEvents(1, 1000);
		messages = await store.getMessages(network as any, chan as any, () => msgid++);
		expect(messages).to.have.length(1);
	});
});
