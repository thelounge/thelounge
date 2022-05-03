"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'expect'.
const expect = require("chai").expect;
const parseIrcUri = require("../../../../client/js/helpers/parseIrcUri").default;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("parseIrcUri helper", function () {
	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should parse irc:// without port", function () {
		expect(parseIrcUri("irc://example.com")).to.deep.equal({
			tls: false,
			name: "example.com",
			host: "example.com",
			port: "6667",
			join: "",
		});
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should parse ircs:// without port", function () {
		expect(parseIrcUri("ircs://example.com")).to.deep.equal({
			tls: true,
			name: "example.com",
			host: "example.com",
			port: "6697",
			join: "",
		});
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should parse irc:// with port", function () {
		expect(parseIrcUri("irc://example.com:1337")).to.deep.equal({
			tls: false,
			name: "example.com",
			host: "example.com",
			port: "1337",
			join: "",
		});
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should parse ircs:// with port", function () {
		expect(parseIrcUri("ircs://example.com:1337")).to.deep.equal({
			tls: true,
			name: "example.com",
			host: "example.com",
			port: "1337",
			join: "",
		});
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should not parse invalid port", function () {
		expect(parseIrcUri("ircs://example.com:lol")).to.deep.equal({});
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should not parse plus in port", function () {
		expect(parseIrcUri("irc://example.com:+6697")).to.deep.equal({});
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should not channel on empty query and hash", function () {
		const obj = {
			tls: false,
			name: "example.com",
			host: "example.com",
			port: "6667",
			join: "",
		};

		expect(parseIrcUri("irc://example.com#")).to.deep.equal(obj);
		expect(parseIrcUri("irc://example.com/")).to.deep.equal(obj);
		expect(parseIrcUri("irc://example.com/#")).to.deep.equal(obj);
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should parse multiple channels", function () {
		const obj = {
			tls: true,
			name: "example.com",
			host: "example.com",
			port: "1337",
			join: "#channel,channel2",
		};

		expect(parseIrcUri("ircs://example.com:1337#channel,channel2")).to.deep.equal(obj);
		expect(parseIrcUri("ircs://example.com:1337/#channel,channel2")).to.deep.equal(obj);

		obj.join = "channel,channel2";
		expect(parseIrcUri("ircs://example.com:1337/channel,channel2")).to.deep.equal(obj);

		obj.join = "chan,#chan2,#chan3";
		expect(parseIrcUri("ircs://example.com:1337/chan,#chan2,#chan3")).to.deep.equal(obj);

		obj.join = "&chan,@chan2,#chan3";
		expect(parseIrcUri("ircs://example.com:1337/&chan,@chan2,#chan3")).to.deep.equal(obj);

		// URL() drops empty hash
		obj.join = "chan";
		expect(parseIrcUri("ircs://example.com:1337/chan#")).to.deep.equal(obj);
	});
});
