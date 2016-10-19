"use strict";

const Handlebars = global.Handlebars = require("handlebars");
const expect = require("chai").expect;

require("../../../../../client/js/libs/handlebars/localetime");

describe("localetime Handlebars helper", () => {

	it("should render a human-readable date", () => {
		const template = Handlebars.compile("{{localetime time}}");

		// 12PM in UTC time
		const date = new Date("2014-05-22T12:00:00");

		// Offset between UTC and local timezone
		const offset = date.getTimezoneOffset() * 60 * 1000;

		// Pretend local timezone is UTC by moving the clock of that offset
		const time = date.getTime() + offset;

		expect(template({time: time})).to.equal("5/22/2014, 12:00:00 PM");
	});

});
