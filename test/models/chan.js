"use strict";

const expect = require("chai").expect;
const Chan = require("../../src/models/chan");
const Msg = require("../../src/models/msg");
const User = require("../../src/models/user");

describe("Chan", function() {
	const network = {
		network: {
			options: {
				PREFIX: [
					{symbol: "~", mode: "q"},
					{symbol: "&", mode: "a"},
					{symbol: "@", mode: "o"},
					{symbol: "%", mode: "h"},
					{symbol: "+", mode: "v"},
				],
			},
		},
	};

	const prefixLookup = {};

	network.network.options.PREFIX.forEach((mode) => {
		prefixLookup[mode.mode] = mode.symbol;
	});

	describe("#findMessage(id)", function() {
		const chan = new Chan({
			messages: [
				new Msg(),
				new Msg({
					text: "Message to be found",
				}),
				new Msg(),
			],
		});

		it("should find a message in the list of messages", function() {
			expect(chan.findMessage(1).text).to.equal("Message to be found");
		});

		it("should not find a message that does not exist", function() {
			expect(chan.findMessage(42)).to.be.undefined;
		});
	});

	describe("#setUser(user)", function() {
		it("should make key lowercase", function() {
			const chan = new Chan();
			chan.setUser(new User({nick: "TestUser"}));

			expect(chan.users.has("testuser")).to.be.true;
		});

		it("should update user object", function() {
			const chan = new Chan();
			chan.setUser(new User({nick: "TestUser"}, prefixLookup));
			chan.setUser(new User({nick: "TestUseR", modes: ["o"]}, prefixLookup));
			const user = chan.getUser("TestUSER");

			expect(user.mode).to.equal("@");
		});
	});

	describe("#getUser(nick)", function() {
		it("should returning existing object", function() {
			const chan = new Chan();
			chan.setUser(new User({nick: "TestUseR", modes: ["o"]}, prefixLookup));
			const user = chan.getUser("TestUSER");

			expect(user.mode).to.equal("@");
		});

		it("should make new User object if not found", function() {
			const chan = new Chan();
			const user = chan.getUser("very-testy-user");

			expect(user.nick).to.equal("very-testy-user");
		});
	});

	describe("#getSortedUsers(irc)", function() {
		var getUserNames = function(chan) {
			return chan.getSortedUsers(network).map((u) => u.nick);
		};

		it("should sort a simple user list", function() {
			const chan = new Chan();
			[
				"JocelynD", "YaManicKill", "astorije", "xPaw", "Max-P",
			].forEach((nick) => chan.setUser(new User({nick: nick}, prefixLookup)));

			expect(getUserNames(chan)).to.deep.equal([
				"astorije", "JocelynD", "Max-P", "xPaw", "YaManicKill",
			]);
		});

		it("should group users by modes", function() {
			const chan = new Chan();
			chan.setUser(new User({nick: "JocelynD", modes: ["a", "o"]}, prefixLookup));
			chan.setUser(new User({nick: "YaManicKill", modes: ["v"]}, prefixLookup));
			chan.setUser(new User({nick: "astorije", modes: ["h"]}, prefixLookup));
			chan.setUser(new User({nick: "xPaw", modes: ["q"]}, prefixLookup));
			chan.setUser(new User({nick: "Max-P", modes: ["o"]}, prefixLookup));

			expect(getUserNames(chan)).to.deep.equal([
				"xPaw", "JocelynD", "Max-P", "astorije", "YaManicKill",
			]);
		});

		it("should sort a mix of users and modes", function() {
			const chan = new Chan();
			chan.setUser(new User({nick: "JocelynD"}, prefixLookup));
			chan.setUser(new User({nick: "YaManicKill", modes: ["o"]}, prefixLookup));
			chan.setUser(new User({nick: "astorije"}, prefixLookup));
			chan.setUser(new User({nick: "xPaw"}, prefixLookup));
			chan.setUser(new User({nick: "Max-P", modes: ["o"]}, prefixLookup));

			expect(getUserNames(chan)).to.deep.equal(
				["Max-P", "YaManicKill", "astorije", "JocelynD", "xPaw"]
			);
		});

		it("should be case-insensitive", function() {
			const chan = new Chan();
			[
				"aB", "Ad", "AA", "ac",
			].forEach((nick) => chan.setUser(new User({nick: nick}, prefixLookup)));

			expect(getUserNames(chan)).to.deep.equal(["AA", "aB", "ac", "Ad"]);
		});

		it("should parse special characters successfully", function() {
			const chan = new Chan();
			[
				"[foo", "]foo", "(foo)", "{foo}", "<foo>", "_foo", "@foo", "^foo",
				"&foo", "!foo", "+foo", "Foo",
			].forEach((nick) => chan.setUser(new User({nick: nick}, prefixLookup)));

			expect(getUserNames(chan)).to.deep.equal([
				"!foo", "&foo", "(foo)", "+foo", "<foo>", "@foo", "[foo", "]foo",
				"^foo", "_foo", "Foo", "{foo}",
			]);
		});
	});
});
