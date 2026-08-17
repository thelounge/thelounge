import {expect} from "vitest";

import NickKeeper from "../../server/models/nickKeeper";

function createKeeper(nick = "preferred", enabled = true) {
	const requested: string[] = [];
	const keeper = new NickKeeper(nick, (askedFor) => requested.push(askedFor), {enabled});

	return {keeper, requested};
}

// Registered under a fallback, the state every reclaim starts from
function createKeeperOnFallback(nick = "preferred", enabled = true) {
	const {keeper, requested} = createKeeper(nick, enabled);

	keeper.nickConfirmed("fallback");

	return {keeper, requested};
}

describe("NickKeeper", function () {
	describe("#nickReleased(nick)", function () {
		it("asks for the desired nick once its holder releases it", function () {
			const {keeper, requested} = createKeeperOnFallback();

			keeper.nickReleased("preferred");

			expect(requested).to.deep.equal(["preferred"]);
		});

		it("ignores a released nick that is not the one we want", function () {
			const {keeper, requested} = createKeeperOnFallback();

			keeper.nickReleased("somebodyelse");

			expect(requested).to.deep.equal([]);
		});

		it("does not ask for a nick we already have", function () {
			const {keeper, requested} = createKeeper();

			keeper.nickConfirmed("preferred");
			keeper.nickReleased("preferred");

			expect(requested).to.deep.equal([]);
		});

		it("never asks in public mode", function () {
			const {keeper, requested} = createKeeperOnFallback("preferred", false);

			keeper.nickReleased("preferred");

			expect(requested).to.deep.equal([]);
		});
	});

	describe("#nickConfirmed(nick)", function () {
		it("keeps the desired nick when the server registers us with a fallback", function () {
			const {keeper} = createKeeperOnFallback();

			expect(keeper.desiredNick).to.equal("preferred");
			expect(keeper.currentNick).to.equal("fallback");
		});

		it("keeps the desired nick when the server renames us against our will", function () {
			const {keeper, requested} = createKeeper();

			keeper.nickConfirmed("preferred");
			keeper.nickConfirmed("Guest1234");

			expect(keeper.desiredNick).to.equal("preferred");

			keeper.nickReleased("preferred");

			expect(requested).to.deep.equal(["preferred"]);
		});
	});

	describe("#nickRefused()", function () {
		it("stops asking for a nick the server refused", function () {
			const {keeper, requested} = createKeeperOnFallback();

			keeper.wantNick("taken");
			keeper.nickRefused();

			expect(keeper.desiredNick).to.equal("fallback");

			keeper.nickReleased("taken");

			expect(requested).to.deep.equal([]);
		});

		it("leaves us wanting nothing more than the nick we have", function () {
			const {keeper, requested} = createKeeperOnFallback();

			keeper.nickRefused();
			keeper.nickReleased("preferred");

			expect(requested).to.deep.equal([]);
		});
	});

	describe("#wantNick(nick)", function () {
		it("stops asking for the nick the user changed their mind about", function () {
			const {keeper, requested} = createKeeperOnFallback();

			keeper.wantNick("somethingelse");
			keeper.nickReleased("preferred");

			expect(requested).to.deep.equal([]);
		});

		it("asks for the new nick once that one is released", function () {
			const {keeper, requested} = createKeeperOnFallback();

			keeper.wantNick("somethingelse");
			keeper.nickReleased("somethingelse");

			expect(requested).to.deep.equal(["somethingelse"]);
		});

		it("does not claim we have the nick before the server confirms it", function () {
			const {keeper} = createKeeperOnFallback();

			keeper.wantNick("somethingelse");

			expect(keeper.currentNick).to.equal("fallback");
		});
	});
});
