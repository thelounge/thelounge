import {expect} from "chai";
import {EventEmitter} from "events";

import Chan from "../../../server/models/chan";
import Network from "../../../server/models/network";
import messageEvents from "../../../server/plugins/irc-events/message";
import {ChanType} from "../../../shared/types/chan";

function setup(networkCount: number) {
	const pushed: {title: string; body: string}[] = [];
	let idChan = 1;

	const network = new Network({name: "Libera", host: "irc.example.com", nick: "me"});
	network.setNick("me");

	const channel = new Chan({name: "#chan", type: ChanType.CHANNEL});
	channel.id = 100;
	network.addChannel(channel);

	const others = Array.from(
		{length: networkCount - 1},
		(_, i) => new Network({name: `other${i}`, host: "irc.example.org", nick: "me"})
	);

	const client = {
		idMsg: 1,
		attachedClients: {},
		mentions: [],
		networks: [network, ...others],
		manager: {
			webPush: {
				push(_client: any, payload: {title: string; body: string}) {
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
		emit() {},
		save() {},
	} as any;

	const irc = new EventEmitter() as any;
	irc.user = {nick: "me"};
	irc.network = {cap: {isEnabled: () => false}};
	network.irc = irc;

	messageEvents.call(client, irc, network as any);

	const privmsg = (nick: string, target: string, message: string) => {
		irc.emit("privmsg", {nick, ident: "u", hostname: "h", target, message});
	};

	return {pushed, privmsg};
}

describe("notification titles", function () {
	it("name the network when there are several", function () {
		const {pushed, privmsg} = setup(2);

		privmsg("alice", "#chan", "me: hello");
		privmsg("bob", "me", "hi");

		expect(pushed.map((p) => p.title)).to.deep.equal([
			"[Libera] #chan (1 mention)",
			"[Libera] bob (1 new message)",
		]);
	});

	it("stay as they were with a single network", function () {
		const {pushed, privmsg} = setup(1);

		privmsg("alice", "#chan", "me: hello");

		expect(pushed.map((p) => p.title)).to.deep.equal(["#chan (1 mention)"]);
	});
});
