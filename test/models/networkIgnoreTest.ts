import {expect} from "chai";
import Network from "../../server/models/network";
import Helper from "../../server/helper";

describe("Network#isIgnoredUser", function () {
	it("should return false when ignore list is empty", function () {
		const network = new Network();
		const result = network.isIgnoredUser({nick: "foo", ident: "bar", hostname: "baz"});
		expect(result).to.be.false;
	});

	it("should match an exact hostmask", function () {
		const network = new Network();
		network.ignoreList.push({
			...Helper.parseHostmask("nick!user@host"),
			when: Date.now(),
		});

		expect(network.isIgnoredUser({nick: "nick", ident: "user", hostname: "host"})).to.be.true;
	});

	it("should match case-insensitively", function () {
		const network = new Network();
		network.ignoreList.push({
			...Helper.parseHostmask("NICK!USER@HOST"),
			when: Date.now(),
		});

		expect(network.isIgnoredUser({nick: "nick", ident: "user", hostname: "host"})).to.be.true;
	});

	it("should match wildcard patterns", function () {
		const network = new Network();
		network.ignoreList.push({
			...Helper.parseHostmask("*!*@spammer.example.com"),
			when: Date.now(),
		});

		expect(network.isIgnoredUser({nick: "anyone", ident: "any", hostname: "spammer.example.com"}))
			.to.be.true;
		expect(network.isIgnoredUser({nick: "anyone", ident: "any", hostname: "good.example.com"}))
			.to.be.false;
	});

	it("should return false when no entry matches", function () {
		const network = new Network();
		network.ignoreList.push({
			...Helper.parseHostmask("badnick!*@*"),
			when: Date.now(),
		});

		expect(network.isIgnoredUser({nick: "goodnick", ident: "user", hostname: "host"})).to.be
			.false;
	});

	it("should match against multiple ignore entries", function () {
		const network = new Network();
		network.ignoreList.push(
			{...Helper.parseHostmask("nick1!*@*"), when: Date.now()},
			{...Helper.parseHostmask("nick2!*@*"), when: Date.now()}
		);

		expect(network.isIgnoredUser({nick: "nick1", ident: "a", hostname: "b"})).to.be.true;
		expect(network.isIgnoredUser({nick: "nick2", ident: "a", hostname: "b"})).to.be.true;
		expect(network.isIgnoredUser({nick: "nick3", ident: "a", hostname: "b"})).to.be.false;
	});
});
