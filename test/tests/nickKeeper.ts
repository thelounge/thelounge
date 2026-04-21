import {expect} from "chai";
import NickKeeper from "../../server/models/nickKeeper";

type Owner = {
	keepNick: string | null;
	getKeepNick(): string | null;
	setKeepNick(nick: string): void;
	clearKeepNick(): void;
};

function createOwner(initial: string | null = null): Owner {
	return {
		keepNick: initial,
		getKeepNick() {
			return this.keepNick;
		},
		setKeepNick(nick: string) {
			this.keepNick = nick;
		},
		clearKeepNick() {
			this.keepNick = null;
		},
	};
}

describe("NickKeeper", function () {
	it("stores preferred nick when nick in use on connect", function () {
		const owner = createOwner();
		const keeper = new NickKeeper(owner);

		keeper.onNickInUse("preferred", {registered: false, isPublic: false});

		expect(owner.keepNick).to.equal("preferred");
	});

	it("does not store preferred nick when already registered", function () {
		const owner = createOwner();
		const keeper = new NickKeeper(owner);

		keeper.onNickInUse("preferred", {registered: true, isPublic: false});

		expect(owner.keepNick).to.equal(null);
	});

	it("does not store preferred nick in public mode", function () {
		const owner = createOwner();
		const keeper = new NickKeeper(owner);

		keeper.onNickInUse("preferred", {registered: false, isPublic: true});

		expect(owner.keepNick).to.equal(null);
	});

	it("clears keepNick when registered with preferred nick", function () {
		const owner = createOwner("preferred");
		const keeper = new NickKeeper(owner);

		const result = keeper.onRegistered("preferred", "preferred");

		expect(result.shouldUpdatePreferred).to.equal(true);
		expect(owner.keepNick).to.equal(null);
	});

	it("does not clear keepNick when registered with fallback", function () {
		const owner = createOwner("preferred");
		const keeper = new NickKeeper(owner);

		const result = keeper.onRegistered("fallback", "preferred");

		expect(result.shouldUpdatePreferred).to.equal(false);
		expect(owner.keepNick).to.equal("preferred");
	});

	it("reclaims preferred nick on quit and clears keepNick", function () {
		const owner = createOwner("preferred");
		const keeper = new NickKeeper(owner);

		const shouldReclaim = keeper.onQuit("preferred");

		expect(shouldReclaim).to.equal(true);
		expect(owner.keepNick).to.equal(null);
	});

	it("does not reclaim when quit nick does not match", function () {
		const owner = createOwner("preferred");
		const keeper = new NickKeeper(owner);

		const shouldReclaim = keeper.onQuit("other");

		expect(shouldReclaim).to.equal(false);
		expect(owner.keepNick).to.equal("preferred");
	});

	it("returns keepNick on socket close and clears it", function () {
		const owner = createOwner("preferred");
		const keeper = new NickKeeper(owner);

		const keepNick = keeper.onSocketClose();

		expect(keepNick).to.equal("preferred");
		expect(owner.keepNick).to.equal(null);
	});

	it("returns null on socket close when no keepNick", function () {
		const owner = createOwner(null);
		const keeper = new NickKeeper(owner);

		const keepNick = keeper.onSocketClose();

		expect(keepNick).to.equal(null);
	});
});
