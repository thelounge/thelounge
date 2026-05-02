import {expect} from "chai";
import {EventEmitter} from "events";

import standardReply from "../../../server/plugins/irc-events/standard-reply";
import {MessageType} from "../../../shared/types/msg";

class FakeChan {
	pushed: any[] = [];
	name: string;

	constructor(name: string) {
		this.name = name;
	}

	pushMessage(_client: any, msg: any, _increment: boolean) {
		this.pushed.push(msg);
	}
}

function setup() {
	const irc = new EventEmitter() as any;
	const lobby = new FakeChan("lobby");
	const channel = new FakeChan("#thelounge");
	const network = {
		getLobby: () => lobby,
		getChannel: (name: string) => (name === channel.name ? channel : undefined),
	} as any;
	const client = {} as any;

	standardReply.call(client, irc, network);
	return {irc, lobby, channel};
}

describe("standard-reply plugin", function () {
	it("gives multiline FAIL replies a readable prefix", function () {
		const {irc, lobby} = setup();

		irc.emit("standard reply", {
			type: "FAIL",
			command: "BATCH",
			code: "MULTILINE_MAX_BYTES",
			context: ["4096"],
			description: "Multiline batch max-bytes exceeded",
		});

		expect(lobby.pushed).to.have.lengthOf(1);
		expect(lobby.pushed[0].type).to.equal(MessageType.ERROR);
		expect(lobby.pushed[0].text).to.contain("Multiline message too long");
		expect(lobby.pushed[0].text).to.contain("Multiline batch max-bytes exceeded");
		expect(lobby.pushed[0].showInActive).to.equal(true);
	});

	it("gives MULTILINE_MAX_LINES a readable prefix", function () {
		const {irc, lobby} = setup();

		irc.emit("standard reply", {
			type: "FAIL",
			command: "BATCH",
			code: "MULTILINE_MAX_LINES",
			context: ["10"],
			description: "Multiline batch max-lines exceeded",
		});

		expect(lobby.pushed).to.have.lengthOf(1);
		expect(lobby.pushed[0].text).to.contain("Too many lines");
	});

	it("falls back to a generic prefix for unknown multiline codes", function () {
		const {irc, lobby} = setup();

		irc.emit("standard reply", {
			type: "FAIL",
			command: "BATCH",
			code: "MULTILINE_SOMETHING_NEW",
			context: [],
			description: "who knows",
		});

		expect(lobby.pushed).to.have.lengthOf(1);
		expect(lobby.pushed[0].text).to.contain("Multiline message rejected");
		expect(lobby.pushed[0].text).to.contain("who knows");
	});

	// The generic handler on master surfaces every standard reply; only the
	// MULTILINE_ codes get rewritten, everything else passes through as-is.
	it("surfaces non-multiline FAIL replies unprefixed", function () {
		const {irc, lobby} = setup();

		irc.emit("standard reply", {
			type: "FAIL",
			command: "BATCH",
			code: "INVALID_REFTAG",
			context: [],
			description: "Bad reftag",
		});

		expect(lobby.pushed).to.have.lengthOf(1);
		expect(lobby.pushed[0].type).to.equal(MessageType.ERROR);
		expect(lobby.pushed[0].text).to.equal("Bad reftag");
	});

	it("maps WARN and NOTE onto their own message types", function () {
		const {irc, lobby} = setup();

		irc.emit("standard reply", {
			type: "WARN",
			command: "BATCH",
			code: "SOME_WARNING",
			context: [],
			description: "warning only",
		});
		irc.emit("standard reply", {
			type: "NOTE",
			command: "BATCH",
			code: "SOME_NOTE",
			context: [],
			description: "just a note",
		});

		expect(lobby.pushed).to.have.lengthOf(2);
		expect(lobby.pushed[0].type).to.equal(MessageType.WARN);
		expect(lobby.pushed[1].type).to.equal(MessageType.NOTE);
	});

	it("routes the reply to a channel named in the context", function () {
		const {irc, lobby, channel} = setup();

		irc.emit("standard reply", {
			type: "FAIL",
			command: "BATCH",
			code: "MULTILINE_INVALID_TARGET",
			context: ["#thelounge"],
			description: "target mismatch",
		});

		expect(lobby.pushed).to.have.lengthOf(0);
		expect(channel.pushed).to.have.lengthOf(1);
		expect(channel.pushed[0].text).to.contain("Mismatched target in multiline message");
	});
});
