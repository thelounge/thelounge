import fs from "fs";
import path from "path";
import {expect} from "vitest";
import Config from "../server/config";
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

	describe("sessions", function () {
		const session = {lastUse: 0, ip: "127.0.0.1", agent: "test"};

		function fakeSocket() {
			const events: string[] = [];

			return {
				events,
				emit: (event: string) => events.push(event),
				disconnect: () => events.push("disconnect"),
			};
		}

		function setup(name = "test") {
			const manager = new ClientManager();
			const client = new Client(manager, name, {
				log: false,
				password: "old-hash",
				sessions: {keep: {...session}, drop: {...session}},
				clientSettings: {},
				networks: [],
			} as any);
			const sockets = {keepSocket: fakeSocket(), dropSocket: fakeSocket()};

			client.attachedClients = {
				keepSocket: {token: "keep", openChannel: 0},
				dropSocket: {token: "drop", openChannel: 0},
			};
			manager.sockets = {
				of: () => ({sockets: new Map(Object.entries(sockets))}),
			} as any;
			manager.clients.push(client);

			return {manager, client, sockets};
		}

		it("signs out attached clients whose session was removed", function () {
			const {client, sockets} = setup();

			client.replaceSessions({keep: {...session}});

			expect(Object.keys(client.config.sessions)).to.deep.equal(["keep"]);
			expect(sockets.keepSocket.events).to.be.empty;
			expect(sockets.dropSocket.events).to.deep.equal(["sign-out", "disconnect"]);
		});

		it("drops every session when the password is reset on disk", function () {
			const name = "reset-test-user";
			const {manager, client, sockets} = setup(name);
			const usersPath = Config.getUsersPath();
			const userPath = Config.getUserConfigPath(name);

			fs.mkdirSync(usersPath, {recursive: true});
			fs.writeFileSync(
				userPath,
				JSON.stringify({...client.config, password: "new-hash", sessions: {}})
			);

			try {
				manager.loadUser(name);
			} finally {
				fs.rmSync(userPath);
			}

			expect(client.config.password).to.equal("new-hash");
			expect(client.config.sessions).to.deep.equal({});
			expect(sockets.keepSocket.events).to.deep.equal(["sign-out", "disconnect"]);
			expect(sockets.dropSocket.events).to.deep.equal(["sign-out", "disconnect"]);
			expect(path.basename(userPath)).to.equal(`${name}.json`);
		});
	});
});
