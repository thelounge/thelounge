import {expect} from "chai";
import Helper from "../../server/helper";

describe("Hostmask", function () {
	it(".parseHostmask", function () {
		expect(Helper.parseHostmask("nick").nick).to.equal("nick");
		expect(Helper.parseHostmask("nick").ident).to.equal("*");
		expect(Helper.parseHostmask("nick").hostname).to.equal("*");

		expect(Helper.parseHostmask("!user").nick).to.equal("*");
		expect(Helper.parseHostmask("!user").ident).to.equal("user");
		expect(Helper.parseHostmask("!user").hostname).to.equal("*");

		expect(Helper.parseHostmask("@host").nick).to.equal("*");
		expect(Helper.parseHostmask("@host").ident).to.equal("*");
		expect(Helper.parseHostmask("@host").hostname).to.equal("host");

		expect(Helper.parseHostmask("!").nick).to.equal("*");
		expect(Helper.parseHostmask("!").ident).to.equal("*");
		expect(Helper.parseHostmask("!").hostname).to.equal("*");

		expect(Helper.parseHostmask("@").nick).to.equal("*");
		expect(Helper.parseHostmask("@").ident).to.equal("*");
		expect(Helper.parseHostmask("@").hostname).to.equal("*");

		expect(Helper.parseHostmask("!@").nick).to.equal("*");
		expect(Helper.parseHostmask("!@").ident).to.equal("*");
		expect(Helper.parseHostmask("!@").hostname).to.equal("*");

		expect(Helper.parseHostmask("nick!user@host").nick).to.equal("nick");
		expect(Helper.parseHostmask("nick!user@host").ident).to.equal("user");
		expect(Helper.parseHostmask("nick!user@host").hostname).to.equal("host");

		expect(Helper.parseHostmask("nick!!!!@thing@@host").nick).to.equal("nick");
		expect(Helper.parseHostmask("nick!!!!@thing@@host").ident).to.equal("*");
		expect(Helper.parseHostmask("nick!!!!@thing@@host").hostname).to.equal("thing");

		expect(Helper.parseHostmask("!!!!@thing@@host").nick).to.equal("*");
		expect(Helper.parseHostmask("!!!!@thing@@host").ident).to.equal("*");
		expect(Helper.parseHostmask("!!!!@thing@@host").hostname).to.equal("thing");

		expect(Helper.parseHostmask("NiCK!uSEr@HOST").nick).to.equal("nick");
		expect(Helper.parseHostmask("NiCK!uSEr@HOST").ident).to.equal("user");
		expect(Helper.parseHostmask("NiCK!uSEr@HOST").hostname).to.equal("host");
	});

	it(".compareHostmask (wildcard)", function () {
		const a = Helper.parseHostmask("nick!user@host");
		const b = Helper.parseHostmask("n?ck!*@*");
		expect(Helper.compareHostmask(b, a)).to.be.true;
		expect(Helper.compareHostmask(a, b)).to.be.false;
	});

	it(".compareHostmask (wildcard - partial)", function () {
		const a = Helper.parseHostmask("nicky!user@host");
		const b = Helper.parseHostmask("nick*!*e?@?os*");
		expect(Helper.compareHostmask(b, a)).to.be.true;
		expect(Helper.compareHostmask(a, b)).to.be.false;
	});

	it(".compareHostmask", function () {
		const a = Helper.parseHostmask("nick!user@host");
		const b = Helper.parseHostmask("NiCK!useR@HOST");
		expect(Helper.compareHostmask(b, a)).to.be.true;
		expect(Helper.compareHostmask(a, b)).to.be.true;
	});
});

describe("compareWithWildcard", function () {
	const goodPairs = [
		["asdf", "asdf"],
		["AsDf", "asdf"],
		["a?df*", "asdf"],
		["*asdf*", "asdf"],
		["*asdf", "asdf"],
		["asd?", "asdf"],
		["asd?*", "asdf"],
		["a??f", "asdf"],
		["a*", "asdf"],
		["*f", "asdf"],
		["*s*", "asdf"],
		["*", ""],
		["**", ""],
	];

	for (const t of goodPairs) {
		it(`("${t[0]}", "${t[1]}")`, function () {
			expect(Helper.compareWithWildcard(t[0], t[1])).to.be.true;
		});
	}

	const badPairs = [
		["asdf", "fdsa"],
		["a?df*", "adfg"],
		["?", ""],
		["?asdf", "asdf"],
		["?*", ""],
		["*?*", ""],
		["*?", ""],
		["asd", "asdf"],
		["sdf", "asdf"],
		["sd", "asdf"],
		["", "asdf"],
	];

	for (const t of badPairs) {
		it(`("${t[0]}", "${t[1]}")`, function () {
			expect(Helper.compareWithWildcard(t[0], t[1])).to.be.false;
		});
	}
});
