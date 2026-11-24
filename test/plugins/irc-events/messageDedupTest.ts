import {expect} from "chai";
import {EventEmitter} from "events";

import Chan from "../../../server/models/chan";
import Network from "../../../server/models/network";
import Config from "../../../server/config";
import messageEvents from "../../../server/plugins/irc-events/message";
import {ChanType} from "../../../shared/types/chan";

function setup() {
	const shown: {chan: number; msg: {text: string}}[] = [];
	const pushed: any[] = [];
	let idChan = 1;

	const network = new Network({name: "test", host: "irc.example.com", nick: "me"});
	network.setNick("me");

	const client = {
		idMsg: 1,
		attachedClients: {},
		mentions: [],
		manager: {
			webPush: {
				push(_client: any, payload: any) {
					pushed.push(payload);
				},
			},
		},
		messageStorage: [],
		createChannel(attr: Partial<Chan>) {
			const chan = new Chan(attr);
			chan.id = idChan++;
			return chan;
		},
		find(chanId: number) {
			const chan = network.channels.find((c) => c.id === chanId);
			return chan ? {network, chan} : undefined;
		},
		emit(event: string, data: any) {
			if (event === "msg") {
				shown.push(data);
			}
		},
		save() {},
	} as any;

	const irc = new EventEmitter() as any;
	irc.user = {nick: "me"};
	irc.network = {cap: {isEnabled: () => false}};
	network.irc = irc;

	messageEvents.call(client, irc, network as any);

	const privmsg = (nick: string, target: string, message: string, msgid?: string) => {
		irc.emit("privmsg", {
			nick,
			ident: "u",
			hostname: "h",
			target,
			message,
			tags: msgid ? {msgid} : {},
		});
	};

	return {network, shown, pushed, privmsg};
}

describe("message deduplication", function () {
	const originalPublic = Config.values.public;

	beforeEach(function () {
		// Windows only keep their messages in private mode
		Config.values.public = false;
	});

	afterEach(function () {
		Config.values.public = originalPublic;
	});

	it("drops a replayed message the window already holds", function () {
		const {network, shown, pushed, privmsg} = setup();

		privmsg("alice", "me", "hello", "msg-1");
		// The server replays the conversation, for example in a chathistory batch
		privmsg("alice", "me", "hello", "msg-1");

		const query = network.channels.find((c) => c.type === ChanType.QUERY);
		expect(query?.messages.map((m) => m.text)).to.deep.equal(["hello"]);
		expect(shown).to.have.lengthOf(1);
		expect(pushed).to.have.lengthOf(1);
	});

	it("keeps messages with a different msgid or none", function () {
		const {shown, privmsg} = setup();

		privmsg("alice", "me", "hello", "msg-1");
		privmsg("alice", "me", "hello again", "msg-2");
		privmsg("alice", "me", "no tags");
		privmsg("alice", "me", "no tags");

		expect(shown.map((m) => m.msg.text)).to.deep.equal([
			"hello",
			"hello again",
			"no tags",
			"no tags",
		]);
	});
});
