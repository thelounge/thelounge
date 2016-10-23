"use strict";

const expect = require("chai").expect;
const Helper = require("../../src/helper");

describe("Client passwords", function() {
	const inputPassword = "my$Super@Cool Password";

	it("hashed password should match", function() {
		// Generated with third party tool to test implementation
		let comparedPassword = Helper.password.compare(inputPassword, "$2a$11$zrPPcfZ091WNfs6QrRHtQeUitlgrJcecfZhxOFiQs0FWw7TN3Q1oS");

		expect(comparedPassword).to.be.true;
	});

	it("freshly hashed password should match", function() {
		let hashedPassword = Helper.password.hash(inputPassword);
		let comparedPassword = Helper.password.compare(inputPassword, hashedPassword);

		expect(comparedPassword).to.be.true;
	});

	it("shout passwords should be marked as old", function() {
		expect(Helper.password.requiresUpdate("$2a$08$K4l.hteJcCP9D1G5PANzYuBGvdqhUSUDOLQLU.xeRxTbvtp01KINm")).to.be.true;
		expect(Helper.password.requiresUpdate("$2a$11$zrPPcfZ091WNfs6QrRHtQeUitlgrJcecfZhxOFiQs0FWw7TN3Q1oS")).to.be.false;
	});
});
