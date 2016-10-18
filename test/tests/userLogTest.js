"use strict";

const expect = require("chai").expect;

const userLog = require("../../src/userLog");

describe("userLog", () => {
	describe("#parseLine", () => {
		it("should correctly parse a normal message", () => {
			const line = "[2014-05-22 12:00:00] <astorije> This is a message.";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				type: "message",
				text: "This is a message.",
			});
		});

		it("should correctly parse an action message", () => {
			const line = "[2014-05-22 12:00:00] * astorije action loves The Lounge.";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				type: "action",
				text: "loves The Lounge.",
			});
		});

		it("should correctly parse a join message", () => {
			const line = "[2014-05-22 12:00:00] * astorije (~astorije@example.com) join";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				hostmask: "~astorije@example.com",
				type: "join",
			});
		});

		it("should correctly parse a join message when hostmask is missing", () => {
			const line = "[2014-05-22 12:00:00] * astorije join";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				hostmask: undefined,
				type: "join",
			});
		});

		it("should correctly parse a mode message", () => {
			const line = "[2014-05-22 12:00:00] * ChanServ mode +v astorije";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "ChanServ",
				text: "+v astorije",
				type: "mode",
			});
		});

		it("should correctly parse a nick change message", () => {
			const line = "[2014-05-22 12:00:00] * astorije nick astorije-lvl-9000";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				type: "nick",
				new_nick: "astorije-lvl-9000",
			});
		});

		it("should correctly parse a part message", () => {
			const line = "[2014-05-22 12:00:00] * astorije (~astorije@example.com) part";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				hostmask: "~astorije@example.com",
				text: "",
				type: "part",
			});
		});

		it("should correctly parse a part message when reason is given", () => {
			const line = "[2014-05-22 12:00:00] * astorije (~astorije@example.com) part \"Goodbye\"";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				hostmask: "~astorije@example.com",
				text: "\"Goodbye\"",
				type: "part",
			});
		});

		it("should correctly parse a part message when hostmask is missing", () => {
			const line = "[2014-05-22 12:00:00] * astorije part";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				hostmask: undefined,
				text: "",
				type: "part",
			});
		});

		it("should correctly parse a quit message", () => {
			const line = "[2014-05-22 12:00:00] * astorije (~astorije@example.com) quit";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				hostmask: "~astorije@example.com",
				text: "",
				type: "quit",
			});
		});

		it("should correctly parse a quit message when reason is given", () => {
			const line = "[2014-05-22 12:00:00] * astorije (~astorije@example.com) quit Farewell";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				hostmask: "~astorije@example.com",
				text: "Farewell",
				type: "quit",
			});
		});

		it("should correctly parse a quit message when hostmask is missing", () => {
			const line = "[2014-05-22 12:00:00] * astorije quit";
			const msg = userLog.parseLine(line);

			expect(msg).to.include({
				from: "astorije",
				hostmask: undefined,
				text: "",
				type: "quit",
			});
		});
	});
});
