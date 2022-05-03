"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'expect'.
const expect = require("chai").expect;
const friendlysize = require("../../../../client/js/helpers/friendlysize").default;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("friendlysize helper", function () {
	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should render human-readable version", function () {
		expect(friendlysize(51200)).to.equal("50 KiB");
		expect(friendlysize(2)).to.equal("2 Bytes");
		expect(friendlysize(1023)).to.equal("1023 Bytes");
		expect(friendlysize(1024)).to.equal("1 KiB");
		expect(friendlysize(Math.pow(1024, 2))).to.equal("1 MiB");
		expect(friendlysize(Math.pow(1024, 3))).to.equal("1 GiB");
		expect(friendlysize(Math.pow(1024, 4))).to.equal("1 TiB");
		expect(friendlysize(Math.pow(1024, 5))).to.equal("1 PiB");
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should round with 1 digit", function () {
		expect(friendlysize(1234567)).to.equal("1.2 MiB");
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should render special case 0 as 0 Bytes", function () {
		expect(friendlysize(0)).to.equal("0 Bytes");
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should render max safe integer as petabytes", function () {
		expect(friendlysize(Number.MAX_SAFE_INTEGER)).to.equal("8 PiB");
	});
});
