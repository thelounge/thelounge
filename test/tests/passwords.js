"use strict";

const expect = require("chai").expect;
const Helper = require("../../src/helper");

describe("Client passwords", function() {
	const inputPassword = "my$Super@Cool Password";

	it("hashed password should match", function() {
		// Generated with third party tool to test implementation
		const comparedPassword = Helper.password.compare(inputPassword, "$2a$11$zrPPcfZ091WNfs6QrRHtQeUitlgrJcecfZhxOFiQs0FWw7TN3Q1oS");

		return comparedPassword.then((result) => {
			expect(result).to.be.true;
		});
	});

	it("wrong hashed password should not match", function() {
		// Compare against a fake hash
		const comparedPassword = Helper.password.compare(inputPassword, "$2a$11$zrPPcfZ091WRONGPASSWORDitlgrJcecfZhxOFiQs0FWw7TN3Q1oS");

		return comparedPassword.then((result) => {
			expect(result).to.be.false;
		});
	});

	it("freshly hashed password should match", function() {
		const hashedPassword = Helper.password.hash(inputPassword);
		const comparedPassword = Helper.password.compare(inputPassword, hashedPassword);

		return comparedPassword.then((result) => {
			expect(result).to.be.true;
		});
	});

	it("shout passwords should be marked as old", function() {
		expect(Helper.password.requiresUpdate("$2a$08$K4l.hteJcCP9D1G5PANzYuBGvdqhUSUDOLQLU.xeRxTbvtp01KINm")).to.be.true;
		expect(Helper.password.requiresUpdate("$2a$11$zrPPcfZ091WNfs6QrRHtQeUitlgrJcecfZhxOFiQs0FWw7TN3Q1oS")).to.be.false;
	});
});
