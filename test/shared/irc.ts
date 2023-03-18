import {expect} from "chai";
import {condensedTypes} from "../../shared/irc";

describe(".condensedTypes", function () {
	it("should be a non-empty array", function () {
		expect(condensedTypes).to.be.an.instanceof(Set).that.is.not.empty;
	});

	it("should only contain ASCII strings", function () {
		condensedTypes.forEach((type) => {
			expect(type).to.be.a("string").that.does.match(/^\w+$/);
		});
	});
});
