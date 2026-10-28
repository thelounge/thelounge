import {expect} from "vitest";
import {NetworkConfig} from "../server/models/network";
import {ChanConfig} from "../server/models/chan";
import {ChanType} from "../shared/types/chan";
import ClientManager from "../server/clientManager";
import Client from "../server/client";
import log from "../server/log";

import sinon from "ts-sinon";

describe("Client", function () {
	const commonNetworkConfig: NetworkConfig = {
		uuid: "67363f03-d903-498b-8e52-031ebb912791",
		awayMessage: "",
		name: "Super Nice Network",
		nick: "thelounge0001",
		host: "example.org",
		port: 6667,
		tls: false,
		userDisconnected: false,
		rejectUnauthorized: true,
		password: "",
		username: "thelounge",
		realname: "thelounge26",
		leaveMessage: "",
		sasl: "",
		saslAccount: "",
		saslPassword: "",
		commands: [],
		ignoreList: [],
		proxyHost: "",
		proxyPort: 1080,
		proxyUsername: "",
		proxyEnabled: false,
		proxyPassword: "",
		channels: [],
	};
	let logWarnStub: sinon.SinonStub<string[], void>;

	beforeAll(function () {
		logWarnStub = sinon.stub(log, "warn");
	});

	afterAll(function () {
		logWarnStub.restore();
	});

	it("should parse channel configuration", function () {
		const manager = new ClientManager();
		const channel: ChanConfig = {name: "AAAA!", type: "query"};
		const networkConfig: NetworkConfig = {
			...commonNetworkConfig,
			channels: [{name: "AAAA!", type: "query"}, {name: "#thelounge"}, {name: "&foobar"}],
		};
		const client = new Client(manager, "test", {
			log: false,
			password: "foo",
			sessions: {},
			clientSettings: {},
			networks: [networkConfig],
		});

		// The client would normally do it as part of client.connect();
		// but this avoids the need to mock the irc-framework connection
		const network = client.networkFromConfig(networkConfig);

		sinon.assert.notCalled(logWarnStub);

		expect(network.channels[0].name).to.equal("Super Nice Network");
		expect(network.channels[0].type).to.equal(ChanType.LOBBY);
		expect(network.channels[1].name).to.equal("AAAA!");
		expect(network.channels[1].type).to.equal(ChanType.QUERY);
		expect(network.channels[2].name).to.equal("#thelounge");
		expect(network.channels[2].type).to.equal(ChanType.CHANNEL);
		expect(network.channels[3].name).to.equal("&foobar");
		expect(network.channels[3].type).to.equal(ChanType.CHANNEL);
	});

	it("should ignore invalid channel types", function () {
		const manager = new ClientManager();
		const channel: ChanConfig = {name: "AAAA!", type: "query"};
		const networkConfig: NetworkConfig = {
			...commonNetworkConfig,
			channels: [
				{name: "AAAA!", type: "query"},
				{name: "#thelounge", type: "wrongtype"},
				{name: "&foobar"},
			],
		};
		const client = new Client(manager, "test", {
			log: false,
			password: "foo",
			sessions: {},
			clientSettings: {},
			networks: [networkConfig],
		});

		// The client would normally do it as part of client.connect();
		// but this avoids the need to mock the irc-framework connection
		const network = client.networkFromConfig(networkConfig);

		sinon.assert.calledOnce(logWarnStub);

		expect(network.channels[0].name).to.equal("Super Nice Network");
		expect(network.channels[0].type).to.equal(ChanType.LOBBY);
		expect(network.channels[1].name).to.equal("AAAA!");
		expect(network.channels[1].type).to.equal(ChanType.QUERY);
		expect(network.channels[2].name).to.equal("&foobar");
		expect(network.channels[2].type).to.equal(ChanType.CHANNEL);
	});

	describe("push subscriptions", function () {
		const keys = {p256dh: "p256dh", auth: "auth"};

		function createClient() {
			return new Client(new ClientManager(), "test", {
				log: false,
				password: "foo",
				sessions: {token: {pushSubscription: undefined}},
				clientSettings: {},
				networks: [],
			} as any);
		}

		it("stores a subscription with a public https endpoint", function () {
			const client = createClient();
			const session: any = {};
			const subscription = {endpoint: "https://push.example.com/abc", keys};

			expect(client.registerPushSubscription(session, subscription, true)).to.deep.equal(
				subscription
			);
			expect(session.pushSubscription).to.deep.equal(subscription);
		});

		it("rejects endpoints that are not public https", function () {
			const client = createClient();

			for (const endpoint of [
				"http://push.example.com/abc",
				"https://localhost/abc",
				"https://127.0.0.1/abc",
				"https://[::1]/abc",
			]) {
				const session: any = {
					pushSubscription: {endpoint: "https://old.example.com", keys},
				};

				expect(client.registerPushSubscription(session, {endpoint, keys}, true), endpoint)
					.to.be.undefined;
				expect(session.pushSubscription, endpoint).to.be.null;
			}
		});

		it("ignores unregister for an unknown session token", function () {
			const client = createClient();

			expect(() => client.unregisterPushSubscription("nope")).to.not.throw();
			expect(() => client.unregisterPushSubscription(undefined as any)).to.not.throw();
		});
	});
});
