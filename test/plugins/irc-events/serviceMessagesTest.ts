import {expect} from "chai";
import {EventEmitter} from "events";

import Chan from "../../../server/models/chan";
import Network from "../../../server/models/network";
import Config from "../../../server/config";
import messageEvents from "../../../server/plugins/irc-events/message";
import {ChanType} from "../../../shared/types/chan";

function setup() {
	const shown: {chan: number; msg: any}[] = [];
	const stored: {channel: string; text: string}[] = [];
	let idChan = 1;

	const network = new Network({name: "test", host: "irc.example.com", nick: "me"});

	const client = {
		idMsg: 1,
		attachedClients: {},
		mentions: [],
		manager: {webPush: {push() {}}},
		messageStorage: [
			{
				index(_network: any, channel: Chan, msg: any) {
					stored.push({channel: channel.name, text: msg.text});
				},
			},
		],
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

	const privmsg = (nick: string, target: string, message: string) => {
		irc.emit("privmsg", {nick, ident: "u", hostname: "h", target, message});
	};

	const queries = () =>
		network.channels.filter((c) => c.type === ChanType.QUERY).map((c) => c.name);

	const notice = (nick: string, target: string, message: string) => {
		irc.emit("notice", {nick, ident: "u", hostname: "h", target, message});
	};

	return {network, shown, stored, privmsg, notice, queries};
}

describe("serviceMessages", function () {
	const original = {...Config.values.serviceMessages};
	const originalPublic = Config.values.public;

	beforeEach(function () {
		// Messages are only stored in private mode
		Config.values.public = false;
		Config.values.serviceMessages = {...original, enable: true};
	});

	afterEach(function () {
		Config.values.public = originalPublic;
		Config.values.serviceMessages = original;
	});

	it("is disabled by default", function () {
		Config.values.serviceMessages = original;
		const {privmsg, queries} = setup();

		privmsg("NickServ", "me", "You are now identified.");

		expect(original.enable).to.equal(false);
		expect(queries()).to.deep.equal(["NickServ"]);
	});

	it("sends private messages from services to the server window", function () {
		const {network, shown, privmsg, queries} = setup();

		privmsg("NickServ", "me", "You are now identified.");

		expect(queries()).to.be.empty;
		expect(shown).to.have.lengthOf(1);
		expect(shown[0].chan).to.equal(network.getLobby().id);
		expect(shown[0].msg.text).to.equal("You are now identified.");
	});

	it("neither shows nor stores our own messages to services", function () {
		const {shown, stored, privmsg, queries} = setup();

		privmsg("me", "NickServ", "IDENTIFY hunter2");
		privmsg("me", "nickserv@services.example", "IDENTIFY hunter2");

		expect(queries()).to.be.empty;
		expect(shown).to.be.empty;
		expect(stored).to.be.empty;
	});

	it("matches the configured nicks case-insensitively", function () {
		Config.values.serviceMessages.nicks = ["Q"];
		const {privmsg, queries} = setup();

		privmsg("q", "me", "You are now logged in.");
		privmsg("NickServ", "me", "You are now identified.");

		expect(queries()).to.deep.equal(["NickServ"]);
	});

	it("still opens query windows for other nicks", function () {
		const {stored, privmsg, queries} = setup();

		privmsg("alice", "me", "hi");
		privmsg("me", "alice", "hello");

		expect(queries()).to.deep.equal(["alice"]);
		expect(stored.map((m) => m.text)).to.deep.equal(["hi", "hello"]);
	});

	it("never highlights messages from services", function () {
		const {network, shown, privmsg, notice} = setup();
		network.setNick("me");
		const query = new Chan({name: "ChanServ", type: ChanType.QUERY});
		query.id = 100;
		network.addChannel(query);

		privmsg("NickServ", "me", "You are now logged in as me.");
		notice("NickServ", "me", "Password accepted, me.");
		privmsg("ChanServ", "me", "me: you are now an operator");
		privmsg("alice", "me", "hi me");

		expect(shown.map((m) => Boolean(m.msg.highlight))).to.deep.equal([
			false,
			false,
			false,
			true,
		]);
	});

	it("keeps using a query window that is already open", function () {
		const {network, shown, privmsg} = setup();
		const query = new Chan({name: "NickServ", type: ChanType.QUERY});
		query.id = 100;
		network.addChannel(query);

		privmsg("me", "NickServ", "INFO");
		privmsg("NickServ", "me", "Information on me");

		expect(shown.map((m) => m.chan)).to.deep.equal([100, 100]);
	});
});
