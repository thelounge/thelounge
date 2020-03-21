"use strict";

const expect = require("chai").expect;

const Network = require("../../src/models/network");

const network = new Network({name: "networkName"});

describe("Nickname highlights", function () {
	it("should NOT highlight nickname", function () {
		network.setNick("lounge-bot");

		expect("").to.not.match(network.highlightRegex);
		expect("  ").to.not.match(network.highlightRegex);
		expect("completely unrelated sentence").to.not.match(network.highlightRegex);
		expect("foobarlounge-bot").to.not.match(network.highlightRegex);
		expect("lounge-botfoobar").to.not.match(network.highlightRegex);
		expect("\x03123lounge-bot").to.not.match(network.highlightRegex);
		expect("lo\x0312unge-bot").to.not.match(network.highlightRegex);
		expect("123lounge-bot").to.not.match(network.highlightRegex);
		expect("lounge-botz").to.not.match(network.highlightRegex);
		expect("lounge-bot123").to.not.match(network.highlightRegex);
		expect("lounge- bot").to.not.match(network.highlightRegex);
		expect("lounge_bot").to.not.match(network.highlightRegex);
		expect("lounge- bot").to.not.match(network.highlightRegex);
		expect("Alounge-bot").to.not.match(network.highlightRegex);
		expect("lounge-botW").to.not.match(network.highlightRegex);
	});

	it("should highlight nickname", function () {
		network.setNick("lounge-bot");

		expect("lounge-bot").to.match(network.highlightRegex);
		expect("LoUnge-Bot").to.match(network.highlightRegex);
		expect("LoUnge-Bot:hello").to.match(network.highlightRegex);
		expect("lounge-bot, hello").to.match(network.highlightRegex);
		expect("lounge-bot: hello").to.match(network.highlightRegex);
		expect("lounge-bot hello").to.match(network.highlightRegex);
		expect("\x0312lounge-bot").to.match(network.highlightRegex);
		expect("lounge-bot\x0312 test").to.match(network.highlightRegex);
		expect("|lounge-bot").to.match(network.highlightRegex);
		expect("www.lounge-bot.example.com").to.match(network.highlightRegex);
		expect(" lounge-bot").to.match(network.highlightRegex);
		expect("@lounge-bot").to.match(network.highlightRegex);
		expect("+lounge-bot").to.match(network.highlightRegex);
		expect("lounge-bot_, hey").to.match(network.highlightRegex);
		expect("lounge-bot-, hey").to.match(network.highlightRegex);
		expect("lounge-bot|sleep, hey").to.match(network.highlightRegex);
		expect("LOUNGE-bot|sleep, hey").to.match(network.highlightRegex);
	});

	it("changing name should update regex", function () {
		network.setNick("lounge-bot");

		expect("lounge-bot, hello").to.match(network.highlightRegex);
		expect("cool_person, hello").to.not.match(network.highlightRegex);

		network.setNick("cool_person");

		expect("lounge-bot, hello").to.not.match(network.highlightRegex);
		expect("cool_person, hello").to.match(network.highlightRegex);
	});
});
