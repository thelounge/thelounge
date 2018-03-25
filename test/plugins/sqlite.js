"use strict";

const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const Msg = require("../../src/models/msg");
const Helper = require("../../src/helper");
const MessageStorage = require("../../src/plugins/sqlite.js");

describe("SQLite Message Storage", function() {
	const expectedPath = path.join(Helper.getHomePath(), "logs", "testUser.sqlite3");
	let store;

	// Delete database file from previous test run
	before(function(done) {
		store = new MessageStorage();

		if (fs.existsSync(expectedPath)) {
			fs.unlink(expectedPath, done);
		} else {
			done();
		}
	});

	it("should resolve an empty array when disabled", function(done) {
		store.getMessages(null, null).then((messages) => {
			expect(messages).to.be.empty;
			done();
		});
	});

	it("should create database file", function() {
		expect(store.isEnabled).to.be.false;
		expect(fs.existsSync(expectedPath)).to.be.false;

		store.enable("testUser");

		expect(store.isEnabled).to.be.true;
	});

	it("should create tables", function(done) {
		store.database.serialize(() =>
			store.database.all("SELECT name, tbl_name, sql FROM sqlite_master WHERE type = 'table'", (err, row) => {
				expect(err).to.be.null;
				expect(row).to.deep.equal([{
					name: "options",
					tbl_name: "options",
					sql: "CREATE TABLE options (name TEXT, value TEXT, CONSTRAINT name_unique UNIQUE (name))",
				},
				{
					name: "messages",
					tbl_name: "messages",
					sql: "CREATE TABLE messages (network TEXT, channel TEXT, time INTEGER, type TEXT, msg TEXT)",
				}]);

				done();
			})
		);
	});

	it("should insert schema version to options table", function(done) {
		store.database.serialize(() =>
			store.database.get("SELECT value FROM options WHERE name = 'schema_version'", (err, row) => {
				expect(err).to.be.null;

				// Should be sqlite.currentSchemaVersion,
				// compared as string because it's returned as such from the database
				expect(row.value).to.equal("1520239200");

				done();
			})
		);
	});

	it("should store a message", function(done) {
		store.database.serialize(() => {
			store.index("this-is-a-network-guid", "#ThisIsAChannel", new Msg({
				time: 123456789,
				text: "Hello from sqlite world!",
			}));

			done();
		});
	});

	it("should retrieve previously stored message", function(done) {
		store.database.serialize(() => store.getMessages({
			uuid: "this-is-a-network-guid",
		}, {
			name: "#thisisaCHANNEL",
		}).then((messages) => {
			expect(messages).to.have.lengthOf(1);

			const msg = messages[0];

			expect(msg.text).to.equal("Hello from sqlite world!");
			expect(msg.type).to.equal(Msg.Type.MESSAGE);
			expect(msg.time.getTime()).to.equal(123456789);

			done();
		}));
	});

	it("should close database", function(done) {
		store.close((err) => {
			expect(err).to.be.null;
			expect(fs.existsSync(expectedPath)).to.be.true;
			done();
		});
	});
});
