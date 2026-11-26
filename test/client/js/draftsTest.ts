import {afterEach, beforeEach, expect, vi} from "vitest";
import Client from "../../../server/client";
import Chan from "../../../server/models/chan";
import Network from "../../../server/models/network";
import {ChanType} from "../../../shared/types/chan";
import type {Draft} from "../../../shared/draft";

// Runs several instances of client/js/drafts.ts against the real server-side
// handling, each with its own storage and connection.

function memoryStorage() {
	const items = new Map<string, string>();

	return {
		items,
		set: (key: string, value: string) => void items.set(key, value),
		get: (key: string): string | null => items.get(key) ?? null,
		remove: (key: string) => void items.delete(key),
		setItem: (key: string, value: string) => void items.set(key, value),
		getItem: (key: string): string | null => items.get(key) ?? null,
		removeItem: (key: string) => void items.delete(key),
	};
}

describe("Drafts", function () {
	let server: any;
	let serverChan: Chan;
	let devices: Map<string, any>;

	beforeEach(function () {
		vi.useFakeTimers();
		devices = new Map();

		serverChan = new Chan({id: 2, name: "#chan"});
		const network = new Network({name: "net", channels: [serverChan]});

		server = Object.create(Client.prototype);
		Object.assign(server, {
			id: "user",
			networks: [network],
			save: vi.fn(),
			manager: {
				sockets: {
					in(room: string) {
						const send = (except?: string) => (_: string, data: any) => {
							for (const [id, device] of devices) {
								if (id !== except && (room === "user" || room === id)) {
									device.receive(data.draft);
								}
							}
						};

						return {emit: send(), except: (id: string) => ({emit: send(id)})};
					},
				},
			},
		});
	});

	afterEach(function () {
		vi.useRealTimers();
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	// Loading a device again with the same storage simulates a page reload
	async function load(
		id: string,
		{local = memoryStorage(), session = memoryStorage(), online = true, isPublic = false} = {}
	) {
		const state = {isConnected: online, serverConfiguration: {public: isPublic}};
		const socket = {
			emit(_: string, data: unknown) {
				server.setDraft(id, JSON.parse(JSON.stringify(data)));
			},
		};

		vi.resetModules();
		vi.doMock("../../../client/js/socket", () => ({default: socket}));
		vi.doMock("../../../client/js/store", () => ({store: {state}}));
		vi.doMock("../../../client/js/localStorage", () => ({default: local}));
		const drafts = await import("../../../client/js/drafts");

		const network: any = {uuid: "uuid"};
		const channel: any = {
			id: 2,
			name: "#chan",
			type: ChanType.CHANNEL,
			pendingMessage: "",
			draftVersion: [],
			draftEditedAt: 0,
			inputHistoryPosition: 0,
			replyingTo: null,
		};

		const useStorage = () => {
			vi.stubGlobal("window", {sessionStorage: session});
		};

		const device = {
			local,
			session,
			channel,
			get text() {
				return String(channel.pendingMessage);
			},
			type(text: string) {
				useStorage();
				channel.pendingMessage = text;
				drafts.draftEdited(network, channel);
			},
			receive(draft: Draft) {
				if (state.isConnected) {
					useStorage();
					drafts.receiveDraft(network, channel, structuredClone(draft));
				}
			},
			connect() {
				useStorage();
				state.isConnected = true;
				devices.set(id, device);
				drafts.restoreDraft(network, channel, structuredClone(serverChan.draft));
			},
			disconnect() {
				state.isConnected = false;
			},
			remove() {
				useStorage();
				drafts.removeDraft(network, channel);
			},
		};

		if (online) {
			device.connect();
		}

		return device;
	}

	const sync = () => vi.advanceTimersByTime(1000);
	const idle = () => vi.advanceTimersByTime(60_000);

	it("should follow the user from one device to another", async function () {
		const laptop = await load("laptop");
		const phone = await load("phone");

		laptop.type("hello wor");
		sync();
		expect(phone.text).to.equal("hello wor");

		phone.type("hello world");
		sync();
		expect(laptop.text).to.equal("hello world");

		laptop.type("hello world!");
		sync();
		expect(phone.text).to.equal("hello world!");
	});

	it("should update the server while the user keeps typing", async function () {
		const laptop = await load("laptop");

		for (let i = 1; i <= 10; i++) {
			laptop.type("x".repeat(i));
			vi.advanceTimersByTime(100);
		}

		expect(serverChan.draft?.text.length).to.be.greaterThan(4);
		sync();
		expect(serverChan.draft?.text).to.equal("x".repeat(10));
	});

	it("should give a newly opened device the draft", async function () {
		const laptop = await load("laptop");
		laptop.type("unsent");
		sync();

		expect((await load("phone")).text).to.equal("unsent");
	});

	it("should clear other devices once sent", async function () {
		const laptop = await load("laptop");
		const phone = await load("phone");

		laptop.type("hi");
		sync();
		phone.channel.replyingTo = {msgid: "1"};
		phone.type("");

		// Without waiting
		expect(laptop.text).to.equal("");
		expect((await load("tablet")).text).to.equal("");
	});

	it("should drop a reply when the draft is sent elsewhere", async function () {
		const laptop = await load("laptop");
		const phone = await load("phone");

		laptop.type("nick: yes");
		laptop.channel.replyingTo = {msgid: "1"};
		sync();
		phone.type("");

		expect(laptop.channel.replyingTo).to.be.null;
	});

	it("should leave both inputs alone when typing in two places at once", async function () {
		const laptop = await load("laptop");
		const phone = await load("phone");

		laptop.type("a");
		phone.type("b");

		for (let i = 0; i < 5; i++) {
			laptop.type(laptop.text + "a");
			vi.advanceTimersByTime(300);
			phone.type(phone.text + "b");
			vi.advanceTimersByTime(300);
		}

		idle();
		expect(laptop.text).to.equal("aaaaaa");
		expect(phone.text).to.equal("bbbbbb");

		// Sending on one does not disturb the other, nor does it get refilled
		phone.type("");
		laptop.type("aaaaaaa");
		sync();
		expect(laptop.text).to.equal("aaaaaaa");
		expect(phone.text).to.equal("");

		// Once left alone for a while, an empty input follows again
		idle();
		laptop.type("aaaaaaaa");
		sync();
		expect(phone.text).to.equal("aaaaaaaa");
		phone.type("");
		expect(laptop.text).to.equal("");
	});

	it("should not replace text which is not synced yet", async function () {
		const laptop = await load("laptop");
		const phone = await load("phone");

		laptop.type("start");
		sync();
		laptop.type("start, laptop");
		phone.type("start, phone");
		sync();

		expect(laptop.text).to.equal("start, laptop");
		expect(phone.text).to.equal("start, phone");
	});

	it("should survive a reload", async function () {
		const laptop = await load("laptop");
		laptop.type("keep me");

		// Before anything was sent to the server
		const reloaded = await load("laptop", laptop);
		expect(reloaded.text).to.equal("keep me");
		expect(serverChan.draft?.text).to.equal("keep me");
	});

	it("should give each device its own text back after typing in two places", async function () {
		const laptop = await load("laptop");
		const phone = await load("phone");
		laptop.type("from laptop");
		phone.type("from phone");
		sync();
		devices.clear();

		expect((await load("laptop", laptop)).text).to.equal("from laptop");
		expect((await load("phone", phone)).text).to.equal("from phone");
	});

	it("should give each tab of a browser its own text back", async function () {
		const first = await load("first");
		const second = await load("second", {local: first.local, session: memoryStorage()});
		first.type("first tab");
		second.type("second tab");
		sync();
		devices.clear();

		expect((await load("first", first)).text).to.equal("first tab");
		expect((await load("second", second)).text).to.equal("second tab");
	});

	it("should restore a closed tab", async function () {
		const laptop = await load("laptop", {online: false});
		laptop.type("never synced");

		expect((await load("laptop", {local: laptop.local})).text).to.equal("never synced");
	});

	it("should send text typed while offline", async function () {
		const laptop = await load("laptop");
		const phone = await load("phone");

		laptop.type("on");
		sync();
		laptop.disconnect();
		laptop.type("online and off");
		sync();
		expect(phone.text).to.equal("on");

		laptop.connect();
		expect(phone.text).to.equal("online and off");
	});

	it("should catch up on reconnect", async function () {
		const laptop = await load("laptop");
		const phone = await load("phone");

		laptop.type("one");
		sync();
		laptop.disconnect();
		phone.type("one two");
		sync();
		phone.type("one two three");
		sync();
		laptop.connect();

		expect(laptop.text).to.equal("one two three");
	});

	it("should not bring back a message sent elsewhere", async function () {
		const laptop = await load("laptop");
		const phone = await load("phone");

		laptop.type("send me");
		sync();
		devices.delete("laptop");
		phone.type("");

		expect((await load("laptop", laptop)).text).to.equal("");
		expect(serverChan.draft?.text).to.equal("");
	});

	it("should not overwrite newer text with text typed offline", async function () {
		const laptop = await load("laptop", {online: false});
		laptop.type("old, offline");
		const phone = await load("phone");
		phone.type("newer");
		sync();
		laptop.connect();

		expect(laptop.text).to.equal("old, offline");
		expect(phone.text).to.equal("newer");
		expect(serverChan.draft?.text).to.equal("newer");
	});

	it("should restore what the server lost", async function () {
		const laptop = await load("laptop");
		laptop.type("persisted locally");
		sync();
		serverChan.draft = undefined;
		await load("laptop", laptop);

		expect(serverChan.draft!.text).to.equal("persisted locally");
	});

	it("should forget the draft of a closed channel", async function () {
		const laptop = await load("laptop");
		laptop.type("bye");
		laptop.remove();
		sync();

		expect(laptop.local.items.size).to.equal(0);
		expect(laptop.session.items.size).to.equal(0);
	});

	it("should do nothing in public mode", async function () {
		const laptop = await load("laptop", {isPublic: true});
		laptop.type("secret");
		sync();

		expect(serverChan.draft).to.be.undefined;
		expect(laptop.local.items.size).to.equal(0);
	});

	it("should ignore invalid requests", function () {
		const draft = {text: "x", version: [["a", 1]]};

		server.setDraft("laptop", {target: 999, draft});
		server.setDraft("laptop", {target: 2, draft: {text: "x"}});
		serverChan.type = ChanType.SPECIAL;
		server.setDraft("laptop", {target: 2, draft});

		expect(serverChan.draft).to.be.undefined;
		expect(server.save).not.toHaveBeenCalled();
	});

	it("should keep drafts across a server restart", function () {
		const network = server.networks[0] as Network;
		serverChan.draft = {text: "channel", version: [["a", 1]]};
		network.getLobby().draft = {text: "/lobby", version: [["a", 2]]};

		server.idChan = 10;
		const restored: Network = server.networkFromConfig(
			JSON.parse(JSON.stringify(network.export()))
		);

		expect(restored.getLobby().draft).to.deep.equal(network.getLobby().draft);
		expect(restored.channels[1].draft).to.deep.equal(serverChan.draft);
		expect(restored.getFilteredClone().channels[1].draft).to.deep.equal(serverChan.draft);
	});
});
