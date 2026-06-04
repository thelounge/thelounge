import {expect} from "vitest";

import NickKeeper from "../../server/models/nickKeeper";

function createRegisteredCallbacks() {
	const calls = {
		preferredNick: null as string | null,
		currentNick: null as string | null,
	};

	return {
		calls,
		callbacks: {
			setPreferredNick(nick: string) {
				calls.preferredNick = nick;
			},
			setCurrentNick(nick: string) {
				calls.currentNick = nick;
			},
		},
	};
}

describe("NickKeeper", function () {
	it("stores desired nick when nick in use on connect", function () {
		const keeper = new NickKeeper("preferred");
		let reclaimedNick: string | null = null;

		keeper.onNickInUse({registered: false, isPublic: false});
		keeper.onQuit("preferred", (nick) => {
			reclaimedNick = nick;
		});

		expect(reclaimedNick).to.equal("preferred");
	});

	it("does not store desired nick when already registered", function () {
		const keeper = new NickKeeper("preferred");
		let reclaimedNick: string | null = null;

		keeper.onNickInUse({registered: true, isPublic: false});
		keeper.onQuit("preferred", (nick) => {
			reclaimedNick = nick;
		});

		expect(reclaimedNick).to.equal(null);
	});

	it("does not store desired nick in public mode", function () {
		const keeper = new NickKeeper("preferred");
		let reclaimedNick: string | null = null;

		keeper.onNickInUse({registered: false, isPublic: true});
		keeper.onQuit("preferred", (nick) => {
			reclaimedNick = nick;
		});

		expect(reclaimedNick).to.equal(null);
	});

	it("updates preferred nick when registered with desired nick", function () {
		const keeper = new NickKeeper("preferred");
		const {calls, callbacks} = createRegisteredCallbacks();
		let reclaimedNick: string | null = null;

		keeper.onNickInUse({registered: false, isPublic: false});
		keeper.onRegistered("preferred", callbacks);
		keeper.onQuit("preferred", (nick) => {
			reclaimedNick = nick;
		});

		expect(calls.preferredNick).to.equal("preferred");
		expect(calls.currentNick).to.equal(null);
		expect(reclaimedNick).to.equal(null);
	});

	it("updates only current nick when registered with fallback", function () {
		const keeper = new NickKeeper("preferred");
		const {calls, callbacks} = createRegisteredCallbacks();
		let reclaimedNick: string | null = null;

		keeper.onNickInUse({registered: false, isPublic: false});
		keeper.onRegistered("fallback", callbacks);
		keeper.onQuit("preferred", (nick) => {
			reclaimedNick = nick;
		});

		expect(calls.preferredNick).to.equal(null);
		expect(calls.currentNick).to.equal("fallback");
		expect(reclaimedNick).to.equal("preferred");
	});

	it("reclaims desired nick when it quits", function () {
		const keeper = new NickKeeper("preferred");
		let reclaimedNick: string | null = null;

		keeper.onNickInUse({registered: false, isPublic: false});
		keeper.onRegistered("fallback", createRegisteredCallbacks().callbacks);
		keeper.onQuit("preferred", (nick) => {
			reclaimedNick = nick;
		});

		expect(reclaimedNick).to.equal("preferred");
	});

	it("does not reclaim when quit nick does not match", function () {
		const keeper = new NickKeeper("preferred");
		let reclaimedNick: string | null = null;

		keeper.onNickInUse({registered: false, isPublic: false});
		keeper.onRegistered("fallback", createRegisteredCallbacks().callbacks);
		keeper.onQuit("other", (nick) => {
			reclaimedNick = nick;
		});

		expect(reclaimedNick).to.equal(null);
	});

	it("reclaims desired nick when another user changes away from it", function () {
		const keeper = new NickKeeper("preferred");
		let reclaimedNick: string | null = null;

		keeper.onNickInUse({registered: false, isPublic: false});
		keeper.onRegistered("fallback", createRegisteredCallbacks().callbacks);
		keeper.onNickChanged("preferred", "other", false, (nick) => {
			reclaimedNick = nick;
		});

		expect(reclaimedNick).to.equal("preferred");
	});

	it("updates desired and current nick after self nick change", function () {
		const keeper = new NickKeeper("preferred");
		let reclaimedNick: string | null = null;

		keeper.onNickInUse({registered: false, isPublic: false});
		keeper.onRegistered("fallback", createRegisteredCallbacks().callbacks);
		keeper.onNickChanged("fallback", "newNick", true, (nick) => {
			reclaimedNick = nick;
		});
		keeper.onQuit("preferred", (nick) => {
			reclaimedNick = nick;
		});

		expect(reclaimedNick).to.equal(null);
	});

	it("restores desired nick on socket close", function () {
		const keeper = new NickKeeper("preferred");
		let restoredNick: string | null = null;

		keeper.onNickInUse({registered: false, isPublic: false});
		keeper.onRegistered("fallback", createRegisteredCallbacks().callbacks);
		keeper.onSocketClose((nick) => {
			restoredNick = nick;
		});

		expect(restoredNick).to.equal("preferred");
	});

	it("does nothing on socket close when there is no pending desired nick", function () {
		const keeper = new NickKeeper("preferred");
		let restoredNick: string | null = null;

		keeper.onSocketClose((nick) => {
			restoredNick = nick;
		});

		expect(restoredNick).to.equal(null);
	});

	it("cancels pending reclaim when user changes desired nick", function () {
		const keeper = new NickKeeper("preferred");
		let reclaimedNick: string | null = null;

		keeper.onNickInUse({registered: false, isPublic: false});
		keeper.setDesiredNick("newNick");
		keeper.onQuit("preferred", (nick) => {
			reclaimedNick = nick;
		});

		expect(reclaimedNick).to.equal(null);
	});
});
