"use strict";

const expect = require("chai").expect;
const parseIrcUri = require("../../../../client/js/helpers/parseIrcUri").default;

describe("parseIrcUri helper", function() {
	it("should parse irc:// without port", function() {
		expect(parseIrcUri("irc://example.com")).to.deep.equal({
			tls: false,
			name: "example.com",
			host: "example.com",
			port: "6667",
			username: "",
			password: "",
			join: "",
		});
	});

	it("should parse ircs:// without port", function() {
		expect(parseIrcUri("ircs://example.com")).to.deep.equal({
			tls: true,
			name: "example.com",
			host: "example.com",
			port: "6697",
			username: "",
			password: "",
			join: "",
		});
	});

	it("should parse irc:// with port", function() {
		expect(parseIrcUri("irc://example.com:1337")).to.deep.equal({
			tls: false,
			name: "example.com",
			host: "example.com",
			port: "1337",
			username: "",
			password: "",
			join: "",
		});
	});

	it("should parse ircs:// with port", function() {
		expect(parseIrcUri("ircs://example.com:1337")).to.deep.equal({
			tls: true,
			name: "example.com",
			host: "example.com",
			port: "1337",
			username: "",
			password: "",
			join: "",
		});
	});

	it("should parse username, password and port", function() {
		expect(parseIrcUri("ircs://user:password@example.com:1337")).to.deep.equal({
			tls: true,
			name: "example.com",
			host: "example.com",
			port: "1337",
			username: "user",
			password: "password",
			join: "",
		});
	});

	it("should parse channel from query", function() {
		expect(parseIrcUri("ircs://example.com:1337/channel,channel2")).to.deep.equal({
			tls: true,
			name: "example.com",
			host: "example.com",
			port: "1337",
			username: "",
			password: "",
			join: "channel",
		});
	});

	it("should parse channel from hash", function() {
		const obj = {
			tls: true,
			name: "example.com",
			host: "example.com",
			port: "1337",
			username: "",
			password: "",
			join: "channel",
		};

		expect(parseIrcUri("ircs://example.com:1337#channel,channel2")).to.deep.equal(obj);
		expect(parseIrcUri("ircs://example.com:1337/#channel,channel2")).to.deep.equal(obj);
	});

	it("accepts query over hash", function() {
		expect(parseIrcUri("ircs://example.com:1337/channel#channel2")).to.deep.equal({
			tls: true,
			name: "example.com",
			host: "example.com",
			port: "1337",
			username: "",
			password: "",
			join: "channel",
		});
	});

	it("should not parse invalid port", function() {
		expect(parseIrcUri("ircs://example.com:lol")).to.deep.equal({});
	});

	it("should not channel on empty query and hash", function() {
		expect(parseIrcUri("irc://example.com/#")).to.deep.equal({
			tls: false,
			name: "example.com",
			host: "example.com",
			port: "6667",
			username: "",
			password: "",
			join: "",
		});
	});
});
