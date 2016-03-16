"use strict";

var expect = require("chai").expect;

var Chan = require("../../src/models/chan");
var User = require("../../src/models/user");

function makeUser(name, mode) {
	return new User({name: name, mode: mode});
}

function getUserNames(chan) {
	return chan.users.map(function(u) { return u.name; });
}

describe("Chan", function() {
	describe("#sortUsers()", function() {

		it("should sort a simple user list", function() {
			var chan = new Chan({users: [
				"JocelynD", "YaManicKill", "astorije", "xPaw", "Max-P"
			].map(makeUser)});
			chan.sortUsers();

			expect(getUserNames(chan)).to.deep.equal([
				"astorije", "JocelynD", "Max-P", "xPaw", "YaManicKill"
			]);
		});

		it("should group users by modes", function() {
			var chan = new Chan({users: [
				new User({name: "JocelynD", mode: "&"}),
				new User({name: "YaManicKill", mode: "+"}),
				new User({name: "astorije", mode: "%"}),
				new User({name: "xPaw", mode: "~"}),
				new User({name: "Max-P", mode: "@"}),
			]});
			chan.sortUsers();

			expect(getUserNames(chan)).to.deep.equal([
				"xPaw", "JocelynD", "Max-P", "astorije", "YaManicKill"
			]);
		});

		it("should sort a mix of users and modes", function() {
			var chan = new Chan({users: [
				new User({name: "JocelynD"}),
				new User({name: "YaManicKill", mode: "@"}),
				new User({name: "astorije"}),
				new User({name: "xPaw"}),
				new User({name: "Max-P", mode: "@"}),
			]});
			chan.sortUsers();

			expect(getUserNames(chan)).to.deep.equal(
				["Max-P", "YaManicKill", "astorije", "JocelynD", "xPaw"]
			);
		});

		it("should be case-insensitive", function() {
			var chan = new Chan({users: ["aB", "Ad", "AA", "ac"].map(makeUser)});
			chan.sortUsers();

			expect(getUserNames(chan)).to.deep.equal(["AA", "aB", "ac", "Ad"]);
		});

		it("should parse special characters successfully", function() {
			var chan = new Chan({users: [
				"[foo", "]foo", "(foo)", "{foo}", "<foo>", "_foo", "@foo", "^foo",
				"&foo", "!foo", "+foo", "Foo"
			].map(makeUser)});
			chan.sortUsers();

			expect(getUserNames(chan)).to.deep.equal([
				"!foo", "&foo", "(foo)", "+foo", "<foo>", "@foo", "[foo", "]foo",
				"^foo", "_foo", "Foo", "{foo}"
			]);
		});
	});
});
