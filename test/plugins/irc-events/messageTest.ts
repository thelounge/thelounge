import {expect} from "chai";
import {EventEmitter} from "events";

import message from "../../../server/plugins/irc-events/message";
import User from "../../../server/models/user";
import Prefix from "../../../server/models/prefix";
import {ChanType} from "../../../shared/types/chan";
import {MessageType} from "../../../shared/types/msg";

class FakeChan {
	id: number;
	name: string;
	type: ChanType;
	users = new Map<string, User>();
	messages: any[] = [];
	pushed: any[] = [];
	highlight = 0;
	muted = false;

	constructor(id: number, name: string, type: ChanType) {
		this.id = id;
		this.name = name;
		this.type = type;
	}

	findUser(nick: string) {
		return this.users.get(nick.toLowerCase());
	}

	getUser(nick: string) {
		return this.findUser(nick) || new User({nick}, new Prefix([]));
	}

	setUser(user: User) {
		this.users.set(user.nick.toLowerCase(), user);
	}

	pushMessage(_client: any, msg: any) {
		this.pushed.push(msg);
	}

	loadMessages() {}

	getFilteredClone() {
		return {};
	}
}

function setup() {
	const irc = Object.assign(new EventEmitter(), {user: {nick: "me"}}) as any;
	const lobby = new FakeChan(1, "example.com", ChanType.LOBBY);
	const channel = new FakeChan(2, "#thelounge", ChanType.CHANNEL);
	const channels = [lobby, channel];
	const network = {
		uuid: "network",
		channels,
		getLobby: () => lobby,
		getChannel: (name: string) =>
			channels.find((chan) => chan.name.toLowerCase() === name.toLowerCase()),
		addChannel: (chan: FakeChan) => channels.push(chan),
		isIgnoredUser: () => false,
	} as any;
	const client = Object.assign(new EventEmitter(), {
		attachedClients: {},
		mentions: [],
		manager: {webPush: {push() {}}},
		createChannel: (opts: {name: string; type: ChanType}) =>
			new FakeChan(channels.length + 1, opts.name, opts.type),
		save() {},
	}) as any;

	message.call(client, irc, network);
	return {irc, network, channel};
}

function privmsg(irc: any, overrides: Record<string, any> = {}) {
	irc.emit("privmsg", {
		nick: "other",
		ident: "ident",
		hostname: "example.com",
		target: "me",
		message: "hello",
		tags: {},
		...overrides,
	});
}

describe("message handler", function () {
	it("shows a private message in the query window", function () {
		const {irc, network, channel} = setup();

		privmsg(irc);

		const query = network.getChannel("other");
		expect(query.type).to.equal(ChanType.QUERY);
		expect(query.pushed).to.have.lengthOf(1);
		expect(query.pushed[0].type).to.equal(MessageType.MESSAGE);
		expect(channel.pushed).to.be.empty;
	});

	it("routes a message with +channel-context into the channel for a member", function () {
		const {irc, network, channel} = setup();
		channel.setUser(new User({nick: "other"}, new Prefix([])));

		privmsg(irc, {tags: {"+channel-context": "#thelounge"}});

		expect(channel.pushed).to.have.lengthOf(1);
		expect(channel.pushed[0].from.nick).to.equal("other");
		expect(network.getChannel("other")).to.equal(undefined);
	});

	it("keeps a message with +channel-context in the query when the sender is not in the channel", function () {
		const {irc, network, channel} = setup();

		privmsg(irc, {tags: {"+channel-context": "#thelounge"}});

		expect(channel.pushed).to.be.empty;
		expect(network.getChannel("other").pushed).to.have.lengthOf(1);
	});

	it("ignores +channel-context on a channel message", function () {
		const {irc, network, channel} = setup();
		const other = new FakeChan(3, "#other", ChanType.CHANNEL);
		network.channels.push(other);
		other.setUser(new User({nick: "other"}, new Prefix([])));

		privmsg(irc, {target: "#thelounge", tags: {"+channel-context": "#other"}});

		expect(channel.pushed).to.have.lengthOf(1);
		expect(other.pushed).to.be.empty;
	});
});
