import {expect} from "chai";
import {EventEmitter} from "events";

import standardReply from "../../../server/plugins/irc-events/standard-reply";
import {MessageType} from "../../../shared/types/msg";

class FakeChan {
	name = "lobby";
	pushed: any[] = [];
	pushMessage(_client: any, msg: any, _increment: boolean) {
		this.pushed.push(msg);
	}
}

function setup() {
	const irc = new EventEmitter() as any;
	const lobby = new FakeChan();
	const network = {
		getLobby: () => lobby,
	} as any;
	const client = {} as any;

	standardReply.call(client, irc, network);
	return {irc, lobby};
}

describe("standard-reply plugin", function () {
	it("surfaces FAIL BATCH MULTILINE_MAX_BYTES as a MessageType.ERROR", function () {
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

	it("surfaces FAIL BATCH MULTILINE_MAX_LINES", function () {
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

	it("ignores non-multiline FAIL replies", function () {
		const {irc, lobby} = setup();

		irc.emit("standard reply", {
			type: "FAIL",
			command: "BATCH",
			code: "INVALID_REFTAG",
			context: [],
			description: "Bad reftag",
		});

		expect(lobby.pushed).to.have.lengthOf(0);
	});

	it("ignores non-FAIL standard replies", function () {
		const {irc, lobby} = setup();

		irc.emit("standard reply", {
			type: "WARN",
			command: "BATCH",
			code: "MULTILINE_MAX_BYTES",
			context: [],
			description: "warning only",
		});

		expect(lobby.pushed).to.have.lengthOf(0);
	});

	it("ignores FAIL replies for other commands", function () {
		const {irc, lobby} = setup();

		irc.emit("standard reply", {
			type: "FAIL",
			command: "JOIN",
			code: "MULTILINE_MAX_BYTES",
			context: [],
			description: "should not appear",
		});

		expect(lobby.pushed).to.have.lengthOf(0);
	});
});
