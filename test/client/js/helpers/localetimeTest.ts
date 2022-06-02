import {expect} from "chai";
import localetime from "../../../../client/js/helpers/localetime";

describe("localetime helper", () => {
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
