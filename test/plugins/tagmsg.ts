import {expect} from "chai";
import util from "../util";
import tagmsg from "../../server/plugins/irc-events/tagmsg";
import Chan from "../../server/models/chan";
import {ChanType} from "../../shared/types/chan";

describe("tagmsg handler", function () {
	let irc: any;
	let network: ReturnType<typeof util.createNetwork>;
	let client: any;

	beforeEach(function () {
		client = util.createClient();
		irc = Object.assign(util.createClient(), {
			user: {nick: "test-user"},
		});
		network = util.createNetwork();
		network.channels[0].type = ChanType.CHANNEL;

		tagmsg.call(client, irc, network as any);
	});

	function emitTagmsg(overrides: Record<string, any> = {}) {
		irc.emit("tagmsg", {
			nick: "other-user",
			ident: "ident",
			hostname: "example.com",
			target: "#test-channel",
			tags: {},
			...overrides,
		});
	}

	it("should ignore tagmsg from self", function () {
		let emitted = false;

		client.on("typing", () => {
			emitted = true;
		});

		emitTagmsg({nick: "test-user", tags: {"+typing": "active"}});
		expect(emitted).to.be.false;
	});

	it("should ignore tagmsg for unknown channels", function () {
		let emitted = false;

		client.on("typing", () => {
			emitted = true;
		});

		emitTagmsg({target: "#unknown-channel", tags: {"+typing": "active"}});
		expect(emitted).to.be.false;
	});

	it("should ignore ignored users", function () {
		network.ignoreList = [
			{
				nick: "ignored-*",
				ident: "*",
				hostname: "*",
				when: 0,
			},
		];

		let emitted = false;

		client.on("typing", () => {
			emitted = true;
		});

		emitTagmsg({nick: "ignored-user", tags: {"+typing": "active"}});
		expect(emitted).to.be.false;
	});

	it("should ignore non-channel and non-query types", function () {
		const special = new Chan({name: "#special", type: ChanType.SPECIAL});
		network.channels.push(special);

		let emitted = false;

		client.on("typing", () => {
			emitted = true;
		});

		emitTagmsg({target: "#special", tags: {"+typing": "active"}});
		expect(emitted).to.be.false;
	});

	it("should redirect PM target to sender nick", function (done) {
		const query = new Chan({name: "other-user", type: ChanType.QUERY});
		network.channels.push(query);

		client.on("typing", function (data: any) {
			expect(data.chan).to.equal(query.id);
			done();
		});

		emitTagmsg({target: "test-user", tags: {"+typing": "active"}});
	});

	it("should ignore tagmsg without recognized tags", function () {
		let emitted = false;

		client.on("typing", () => {
			emitted = true;
		});

		emitTagmsg({tags: {"some-other-tag": "value"}});
		expect(emitted).to.be.false;
	});

	describe("+typing", function () {
		it("should emit typing event for +typing tag", function (done) {
			client.on("typing", function (data: any) {
				expect(data.nick).to.equal("other-user");
				expect(data.status).to.equal("active");
				expect(data.chan).to.equal(network.channels[0].id);
				expect(data.network).to.equal(network.uuid);
				done();
			});

			emitTagmsg({tags: {"+typing": "active"}});
		});

		it("should support all valid typing statuses", function (done) {
			const statuses: string[] = [];

			client.on("typing", function (data: any) {
				statuses.push(data.status);

				if (statuses.length === 3) {
					expect(statuses).to.deep.equal(["active", "paused", "done"]);
					done();
				}
			});

			emitTagmsg({tags: {"+typing": "active"}});
			emitTagmsg({tags: {"+typing": "paused"}});
			emitTagmsg({tags: {"+typing": "done"}});
		});

		it("should support +draft/typing tag", function (done) {
			client.on("typing", function (data: any) {
				expect(data.status).to.equal("active");
				done();
			});

			emitTagmsg({tags: {"+draft/typing": "active"}});
		});

		it("should ignore invalid typing statuses", function () {
			let emitted = false;

			client.on("typing", () => {
				emitted = true;
			});

			emitTagmsg({tags: {"+typing": "invalid"}});
			expect(emitted).to.be.false;
		});
	});
});
