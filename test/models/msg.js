"use strict";

const expect = require("chai").expect;

const Msg = require("../../src/models/msg");

describe("Msg", function() {
	describe("#findPreview(link)", function() {
		const msg = new Msg({
			previews: [{
				body: "",
				head: "Example Domain",
				link: "https://example.org/",
				thumb: "",
				type: "link",
				shown: true,
			}, {
				body: "",
				head: "The Lounge",
				link: "https://thelounge.github.io/",
				thumb: "",
				type: "link",
				shown: true,
			}]
		});

		it("should find a preview given an existing link", function() {
			expect(msg.findPreview("https://thelounge.github.io/").head)
				.to.equal("The Lounge");
		});

		it("should not find a preview that does not exist", function() {
			expect(msg.findPreview("https://github.com/thelounge/lounge"))
				.to.be.undefined;
		});
	});
});
