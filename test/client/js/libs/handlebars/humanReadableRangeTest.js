"use strict";

const Handlebars = global.Handlebars = require("handlebars");
const expect = require("chai").expect;

require("../../../../../client/js/libs/handlebars/humanReadableRange");

describe("humanReadableRange Handlebars helper", () => {
	const template = Handlebars.compile("{{humanReadableRange range}}");

	it("should build a simple range", () => {
		expect(template({range: 30})).to.equal("30 seconds");
	});

	it("should not display zero values", () => {
		expect(template({range: 86400 * 3 + 120})).to.equal("3 days and 2 minutes");
	});

	it("should pluralize things properly", () => {
		expect(template({range: 3600})).to.equal("1 hour");
		expect(template({range: 3600 * 2})).to.equal("2 hours");
	});

	it("should use commas and 'and' in complex expressions", () => {
		expect(template({range: 604800 + 86400 + 3600 + 60 + 1}))
			.to.equal("1 week, 1 day, 1 hour, 1 minute and 1 second");
	});
});
