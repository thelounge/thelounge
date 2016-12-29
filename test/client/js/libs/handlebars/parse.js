"use strict";

require("babel-register");

const expect = require("chai").expect;

it("verify that import works", () => {

	expect(() => {
		require("../../../../../client/js/libs/handlebars/parse");
	}).to.not.throw(Error);

});
