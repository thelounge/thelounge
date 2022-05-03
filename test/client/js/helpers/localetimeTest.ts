"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'expect'.
const expect = require("chai").expect;
const localetime = require("../../../../client/js/helpers/localetime").default;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("localetime helper", () => {
	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should render a human-readable date", () => {
		// 12PM in UTC time
		const date = new Date("2014-05-22T12:00:00Z");

		// Offset between UTC and local timezone
		const offset = date.getTimezoneOffset() * 60 * 1000;

		// Pretend local timezone is UTC by moving the clock of that offset
		const time = date.getTime() + offset;

		expect(localetime(time)).to.equal("22 May 2014, 12:00:00");
	});
});
