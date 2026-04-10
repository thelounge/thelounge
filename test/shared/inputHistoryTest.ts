import {expect} from "chai";
import {extractInputHistory} from "../../client/js/helpers/inputHistory";
import {MessageType} from "../../shared/types/msg";

describe("extractInputHistory helper", function () {
	it("should extract self-authored messages", function () {
		const messages = [
			{self: true, text: "hello", type: MessageType.MESSAGE},
			{self: false, text: "world", type: MessageType.MESSAGE},
			{self: true, text: "foo", type: MessageType.MESSAGE},
		];

		const result = extractInputHistory(messages as any, 100);
		expect(result).to.deep.equal(["foo", "hello"]);
	});

	it("should only include MESSAGE type", function () {
		const messages = [
			{self: true, text: "msg", type: MessageType.MESSAGE},
			{self: true, text: "action", type: MessageType.ACTION},
			{self: true, text: "notice", type: MessageType.NOTICE},
		];

		const result = extractInputHistory(messages as any, 100);
		expect(result).to.deep.equal(["msg"]);
	});

	it("should skip messages with empty text", function () {
		const messages = [
			{self: true, text: "", type: MessageType.MESSAGE},
			{self: true, text: undefined, type: MessageType.MESSAGE},
			{self: true, text: "valid", type: MessageType.MESSAGE},
		];

		const result = extractInputHistory(messages as any, 100);
		expect(result).to.deep.equal(["valid"]);
	});

	it("should return most recent first", function () {
		const messages = [
			{self: true, text: "first", type: MessageType.MESSAGE},
			{self: true, text: "second", type: MessageType.MESSAGE},
			{self: true, text: "third", type: MessageType.MESSAGE},
		];

		const result = extractInputHistory(messages as any, 100);
		expect(result[0]).to.equal("third");
		expect(result[2]).to.equal("first");
	});

	it("should respect the limit parameter", function () {
		const messages = [
			{self: true, text: "a", type: MessageType.MESSAGE},
			{self: true, text: "b", type: MessageType.MESSAGE},
			{self: true, text: "c", type: MessageType.MESSAGE},
		];

		const result = extractInputHistory(messages as any, 2);
		expect(result).to.have.lengthOf(2);
	});

	it("should return empty array for no matching messages", function () {
		const messages = [
			{self: false, text: "nope", type: MessageType.MESSAGE},
		];

		const result = extractInputHistory(messages as any, 100);
		expect(result).to.be.empty;
	});
});
