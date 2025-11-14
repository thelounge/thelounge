import {expect, assert} from "chai";
import {condensedTypes} from "../../shared/irc";

describe(".condensedTypes", function () {
	it("should be a non-empty array", function () {
		assert.instanceOf(condensedTypes, Set);
		assert.isNotEmpty(condensedTypes);
	});

	it("should only contain ASCII strings", function () {
		condensedTypes.forEach((type) => {
			expect(type).to.be.a("string").that.does.match(/^\w+$/);
		});
	});
});
