"use strict";

const expect = require("chai").expect;
const tojson = require("../../../../../client/js/libs/handlebars/tojson");

describe("tojson Handlebars helper", function() {
	it("should return JSON strings", function() {
		expect(tojson([])).to.equal("[]");
		expect(tojson({})).to.equal("{}");
		expect(tojson("")).to.equal('""');
		expect(tojson({foo: "bar"})).to.be.equal('{"foo":"bar"}');
	});
});
