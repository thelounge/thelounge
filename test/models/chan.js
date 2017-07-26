"use strict";

var expect = require("chai").expect;

var Chan = require("../../src/models/chan");
var Msg = require("../../src/models/msg");
var User = require("../../src/models/user");

describe("Chan", function() {
	describe("#findMessage(id)", function() {
		const chan = new Chan({
			messages: [
				new Msg(),
				new Msg({
					text: "Message to be found"
				}),
				new Msg()
			]
		});

		it("should find a message in the list of messages", function() {
			expect(chan.findMessage(1).text).to.equal("Message to be found");
		});

		it("should not find a message that does not exist", function() {
			expect(chan.findMessage(42)).to.be.undefined;
		});
	});

	describe("#sortUsers(irc)", function() {
		var network = {
			network: {
				options: {
					PREFIX: [
						{symbol: "~", mode: "q"},
						{symbol: "&", mode: "a"},
						{symbol: "@", mode: "o"},
						{symbol: "%", mode: "h"},
						{symbol: "+", mode: "v"}
					]
				}
			}
		};

		var prefixLookup = {};

		network.network.options.PREFIX.forEach((mode) => {
			prefixLookup[mode.mode] = mode.symbol;
		});

		var makeUser = function(nick) {
			return new User({nick: nick}, prefixLookup);
		};

		var getUserNames = function(chan) {
			return chan.users.map((u) => u.nick);
		};

		it("should sort a simple user list", function() {
			var chan = new Chan({users: [
				"JocelynD", "YaManicKill", "astorije", "xPaw", "Max-P"
			].map(makeUser)});
			chan.sortUsers(network);

			expect(getUserNames(chan)).to.deep.equal([
				"astorije", "JocelynD", "Max-P", "xPaw", "YaManicKill"
			]);
		});

		it("should group users by modes", function() {
			var chan = new Chan({users: [
				new User({nick: "JocelynD", modes: ["a", "o"]}, prefixLookup),
				new User({nick: "YaManicKill", modes: ["v"]}, prefixLookup),
				new User({nick: "astorije", modes: ["h"]}, prefixLookup),
				new User({nick: "xPaw", modes: ["q"]}, prefixLookup),
				new User({nick: "Max-P", modes: ["o"]}, prefixLookup),
			]});
			chan.sortUsers(network);

			expect(getUserNames(chan)).to.deep.equal([
				"xPaw", "JocelynD", "Max-P", "astorije", "YaManicKill"
			]);
		});

		it("should sort a mix of users and modes", function() {
			var chan = new Chan({users: [
				new User({nick: "JocelynD"}, prefixLookup),
				new User({nick: "YaManicKill", modes: ["o"]}, prefixLookup),
				new User({nick: "astorije"}, prefixLookup),
				new User({nick: "xPaw"}, prefixLookup),
				new User({nick: "Max-P", modes: ["o"]}, prefixLookup),
			]});
			chan.sortUsers(network);

			expect(getUserNames(chan)).to.deep.equal(
				["Max-P", "YaManicKill", "astorije", "JocelynD", "xPaw"]
			);
		});

		it("should be case-insensitive", function() {
			var chan = new Chan({users: ["aB", "Ad", "AA", "ac"].map(makeUser)});
			chan.sortUsers(network);

			expect(getUserNames(chan)).to.deep.equal(["AA", "aB", "ac", "Ad"]);
		});

		it("should parse special characters successfully", function() {
			var chan = new Chan({users: [
				"[foo", "]foo", "(foo)", "{foo}", "<foo>", "_foo", "@foo", "^foo",
				"&foo", "!foo", "+foo", "Foo"
			].map(makeUser)});
			chan.sortUsers(network);

			expect(getUserNames(chan)).to.deep.equal([
				"!foo", "&foo", "(foo)", "+foo", "<foo>", "@foo", "[foo", "]foo",
				"^foo", "_foo", "Foo", "{foo}"
			]);
		});
	});
});
