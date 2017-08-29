"use strict";

const expect = require("chai").expect;
const moment = require("moment");
const friendlydate = require("../../../../../client/js/libs/handlebars/friendlydate");

describe("friendlydate Handlebars helper", () => {
	it("should render 'Today' as a human-friendly date", () => {
		const time = new Date().getTime();
		expect(friendlydate(time)).to.equal("Today");
	});

	it("should render 'Yesterday' as a human-friendly date", () => {
		const time = new Date().getTime() - 24 * 3600 * 1000;
		expect(friendlydate(time)).to.equal("Yesterday");
	});

	it("should not render any friendly dates prior to the day before", () => {
		[2, 7, 30, 365, 1000].forEach((day) => {
			const time = new Date().getTime() - 24 * 3600 * 1000 * day;
			expect(friendlydate(time)).to.equal(moment(time).format("D MMMM YYYY"));
		});
	});
});
