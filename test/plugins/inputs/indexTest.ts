import {expect, assert} from "chai";
import inputs from "../../../server/plugins/inputs";

describe("inputs", function () {
	describe(".getCommands", function () {
		it("should return a non-empty array", function () {
			const commands = inputs.getCommands();
			assert.isArray(commands);
			assert.isNotEmpty(commands);
		});

		it("should only return strings with no whitespaces and starting with /", function () {
			inputs.getCommands().forEach((command) => {
				expect(command).to.be.a("string").that.does.not.match(/\s/);
				expect(command[0]).to.equal("/");
			});
		});
	});
});
