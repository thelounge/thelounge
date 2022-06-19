import {expect} from "chai";
import inputs from "../../../server/plugins/inputs";

describe("inputs", function () {
	describe(".getCommands", function () {
		it("should return a non-empty array", function () {
			expect(inputs.getCommands()).to.be.an("array").that.is.not.empty;
		});

		it("should only return strings with no whitespaces and starting with /", function () {
			inputs.getCommands().forEach((command) => {
				expect(command).to.be.a("string").that.does.not.match(/\s/);
				expect(command[0]).to.equal("/");
			});
		});
	});
});
