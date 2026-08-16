import {expect} from "chai";

import msgInput from "../../../server/plugins/inputs/msg";
import Chan from "../../../server/models/chan";
import {ChanType} from "../../../shared/types/chan";

type Sent = {type: "say" | "multiline"; target: string; text: string};

function setup({limits}: {limits: {maxBytes: number; maxLines: number | null} | null}) {
	const sent: Sent[] = [];
	const echoed: Array<{message: string; multiline?: boolean}> = [];
	const chan = new Chan({name: "#thelounge", type: ChanType.CHANNEL});

	const irc = {
		user: {nick: "alice", username: "alice", host: "localhost"},
		network: {
			cap: {isEnabled: (cap: string) => cap === "draft/multiline"},
			multilineLimits: () => limits,
			extractTargetGroup: () => undefined,
		},
		say(target: string, text: string) {
			sent.push({type: "say", target, text});
		},
		sayMultiline(target: string, lines: string[]) {
			if (limits && lines.join("\n").length > limits.maxBytes) {
				const error = new Error("too long") as Error & {code: string};
				error.code = "MULTILINE_MAX_BYTES";
				throw error;
			}

			sent.push({type: "multiline", target, text: lines.join("\n")});
		},
		emit(_event: string, data: {message: string; multiline?: boolean}) {
			echoed.push(data);
		},
	};

	const network = {
		irc,
		serverOptions: {supportsReply: false},
		getChannel: (name: string) => (name === chan.name ? chan : undefined),
	};

	const send = (text: string) =>
		msgInput.input.call({} as any, network as any, chan, "say", text.split(" "), undefined);

	return {send, sent, echoed};
}

describe("msg input", function () {
	it("sends a multiline message as a single batch", function () {
		const {send, sent, echoed} = setup({limits: {maxBytes: 4096, maxLines: null}});

		send("one\ntwo");

		expect(sent).to.deep.equal([{type: "multiline", target: "#thelounge", text: "one\ntwo"}]);
		expect(echoed).to.have.lengthOf(1);
		expect(echoed[0].message).to.equal("one\ntwo");
		expect(echoed[0].multiline).to.equal(true);
	});

	it("sends one message per line when the network advertises no limits", function () {
		const {send, sent, echoed} = setup({limits: null});

		send("one\ntwo");

		expect(sent.map((s) => s.text)).to.deep.equal(["one", "two"]);
		expect(echoed.map((e) => e.message)).to.deep.equal(["one", "two"]);
		expect(echoed.every((e) => e.multiline === undefined)).to.equal(true);
	});

	it("falls back to individual messages when the batch is over max-bytes", function () {
		const {send, sent, echoed} = setup({limits: {maxBytes: 4, maxLines: null}});

		send("one\ntwo");

		// The echo has to match what actually went out, not what we attempted
		expect(sent.map((s) => s.type)).to.deep.equal(["say", "say"]);
		expect(echoed.map((e) => e.message)).to.deep.equal(["one", "two"]);
		expect(echoed.every((e) => e.multiline === undefined)).to.equal(true);
	});

	it("does not send blank lines", function () {
		const {send, sent, echoed} = setup({limits: null});

		send("one\n\ntwo\n");

		expect(sent.map((s) => s.text)).to.deep.equal(["one", "two"]);
		expect(echoed.map((e) => e.message)).to.deep.equal(["one", "two"]);
	});

	it("keeps sending single line messages unbatched", function () {
		const {send, sent, echoed} = setup({limits: {maxBytes: 4096, maxLines: null}});

		send("hello");

		expect(sent).to.deep.equal([{type: "say", target: "#thelounge", text: "hello"}]);
		expect(echoed.map((e) => e.message)).to.deep.equal(["hello"]);
	});
});
