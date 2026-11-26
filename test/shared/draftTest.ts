import {expect} from "vitest";
import {
	DraftVersion,
	draftIncludes,
	editDraftVersion,
	isValidDraft,
	MAX_DRAFT_AUTHORS,
	MAX_DRAFT_LENGTH,
	mergeDraftVersions,
} from "../../shared/draft";

describe("shared/draft", function () {
	const base = editDraftVersion([], "a", 1);
	const byA = editDraftVersion(base, "a", 2);
	const byB = editDraftVersion(base, "b", 1);

	it("should tell later edits apart from independent ones", function () {
		expect(draftIncludes(byA, base)).to.be.true;
		expect(draftIncludes(byB, base)).to.be.true;
		expect(draftIncludes(base, byA)).to.be.false;
		expect(draftIncludes(byA, byB)).to.be.false;
		expect(draftIncludes(byB, byA)).to.be.false;
		expect(draftIncludes(base, [])).to.be.true;
		expect(draftIncludes([], base)).to.be.false;
	});

	it("should include both sides after merging", function () {
		const merged = mergeDraftVersions(byA, byB);

		expect(draftIncludes(merged, byA)).to.be.true;
		expect(draftIncludes(merged, byB)).to.be.true;
		expect(merged[merged.length - 1]).to.deep.equal(["b", 1]);
	});

	it("should stay bounded and keep working past the limit", function () {
		let version: DraftVersion = [];

		for (let i = 0; i < MAX_DRAFT_AUTHORS * 3; i++) {
			const next = editDraftVersion(version, `author${i}`, 1);

			expect(draftIncludes(next, version)).to.be.true;
			version = next;
		}

		expect(version).to.have.lengthOf(MAX_DRAFT_AUTHORS);
		expect(isValidDraft({text: "", version})).to.be.true;
	});

	it("should reject malformed drafts", function () {
		for (const draft of [
			undefined,
			null,
			{},
			{text: "hi"},
			{text: 1, version: base},
			{text: "hi", version: []},
			{text: "hi", version: [["a"]]},
			{text: "hi", version: [["a", "1"]]},
			{text: "hi", version: [[1, 1]]},
			{text: "a".repeat(MAX_DRAFT_LENGTH + 1), version: base},
		]) {
			expect(isValidDraft(draft), JSON.stringify(draft)?.slice(0, 80)).to.be.false;
		}
	});
});
