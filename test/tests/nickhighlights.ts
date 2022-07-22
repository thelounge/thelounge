import {expect} from "chai";

import Network from "../../server/models/network";

const network = new Network({name: "networkName"});

describe("Nickname highlights", function () {
	it("should NOT highlight nickname", function () {
		network.setNick("lounge-bot");

		expect("").to.not.match(network.highlightRegex as any);
		expect("  ").to.not.match(network.highlightRegex as any);
		expect("completely unrelated sentence").to.not.match(network.highlightRegex as any);
		expect("foobarlounge-bot").to.not.match(network.highlightRegex as any);
		expect("lounge-botfoobar").to.not.match(network.highlightRegex as any);
		expect("\x03123lounge-bot").to.not.match(network.highlightRegex as any);
		expect("lo\x0312unge-bot").to.not.match(network.highlightRegex as any);
		expect("123lounge-bot").to.not.match(network.highlightRegex as any);
		expect("lounge-botz").to.not.match(network.highlightRegex as any);
		expect("lounge-bot123").to.not.match(network.highlightRegex as any);
		expect("lounge- bot").to.not.match(network.highlightRegex as any);
		expect("lounge_bot").to.not.match(network.highlightRegex as any);
		expect("lounge- bot").to.not.match(network.highlightRegex as any);
		expect("Alounge-bot").to.not.match(network.highlightRegex as any);
		expect("lounge-botW").to.not.match(network.highlightRegex as any);
	});

	it("should highlight nickname", function () {
		network.setNick("lounge-bot");

		expect("lounge-bot").to.match(network.highlightRegex as any);
		expect("LoUnge-Bot").to.match(network.highlightRegex as any);
		expect("LoUnge-Bot:hello").to.match(network.highlightRegex as any);
		expect("lounge-bot, hello").to.match(network.highlightRegex as any);
		expect("lounge-bot: hello").to.match(network.highlightRegex as any);
		expect("lounge-bot hello").to.match(network.highlightRegex as any);
		expect("\x0312lounge-bot").to.match(network.highlightRegex as any);
		expect("lounge-bot\x0312 test").to.match(network.highlightRegex as any);
		expect("|lounge-bot").to.match(network.highlightRegex as any);
		expect("www.lounge-bot.example.com").to.match(network.highlightRegex as any);
		expect(" lounge-bot").to.match(network.highlightRegex as any);
		expect("@lounge-bot").to.match(network.highlightRegex as any);
		expect("+lounge-bot").to.match(network.highlightRegex as any);
		expect("lounge-bot_, hey").to.match(network.highlightRegex as any);
		expect("lounge-bot-, hey").to.match(network.highlightRegex as any);
		expect("lounge-bot|sleep, hey").to.match(network.highlightRegex as any);
		expect("LOUNGE-bot|sleep, hey").to.match(network.highlightRegex as any);
	});

	it("changing name should update regex", function () {
		network.setNick("lounge-bot");

		expect("lounge-bot, hello").to.match(network.highlightRegex as any);
		expect("cool_person, hello").to.not.match(network.highlightRegex as any);

		network.setNick("cool_person");

		expect("lounge-bot, hello").to.not.match(network.highlightRegex as any);
		expect("cool_person, hello").to.match(network.highlightRegex as any);
	});
});
