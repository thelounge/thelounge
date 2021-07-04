"use strict";

const expect = require("chai").expect;
const inputs = require("../../../src/plugins/inputs");

describe("inputs", function () {
	const client = {
		messageProvider: undefined,
	};
	const clientWithProvider = {
		...client,
		messageProvider: true,
	};

	describe(".getCommands", function () {
		it("should return a non-empty array", function () {
			expect(inputs.getCommands(client)).to.be.an("array").that.is.not.empty;
		});

		it("should only return strings with no whitespaces and starting with /", function () {
			inputs.getCommands(client).forEach((command) => {
				expect(command).to.be.a("string").that.does.not.match(/\s/);
				expect(command[0]).to.equal("/");
			});
		});

		it("should not include /search without a message provider", function () {
			expect(inputs.getCommands(client)).to.be.an("array").that.does.not.contains("/search");
		});

		it("should include /search with a message provider", function () {
			expect(inputs.getCommands(clientWithProvider))
				.to.be.an("array")
				.that.contains("/search");
		});
	});
});
