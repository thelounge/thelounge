"use strict";

const expect = require("chai").expect;

const Chan = require("../../src/models/chan");
const ModeCommand = require("../../src/plugins/inputs/mode");

describe("Commands", function () {
	describe("/mode", function () {
		const channel = new Chan({
			name: "#thelounge",
		});

		const lobby = new Chan({
			name: "Network Lobby",
			type: Chan.Type.LOBBY,
		});

		const testableNetwork = {
			firstCommand: null,
			lastCommand: null,
			nick: "xPaw",
			irc: {
				network: {
					supports(type) {
						if (type.toUpperCase() === "MODES") {
							return "4";
						}
					},
				},
				raw(...args) {
					testableNetwork.firstCommand = testableNetwork.lastCommand;
					testableNetwork.lastCommand = args.join(" ");
				},
			},
		};

		const testableNetworkNoSupports = Object.assign({}, testableNetwork, {
			irc: {
				network: {
					supports() {
						return null;
					},
				},
				raw(...args) {
					testableNetworkNoSupports.firstCommand = testableNetworkNoSupports.lastCommand;
					testableNetworkNoSupports.lastCommand = args.join(" ");
				},
			},
		});

		it("should not mess with the given target", function () {
			const test = function (expected, args) {
				ModeCommand.input(testableNetwork, channel, "mode", Array.from(args));
				expect(testableNetwork.lastCommand).to.equal(expected);

				ModeCommand.input(testableNetwork, lobby, "mode", Array.from(args));
				expect(testableNetwork.lastCommand).to.equal(expected);
			};

			test("MODE xPaw +i", ["xPaw", "+i"]);
			test("MODE xPaw -w", ["xPaw", "-w"]);
			test("MODE #thelounge +o xPaw", ["#thelounge", "+o", "xPaw"]);
			test("MODE #thelounge -v xPaw", ["#thelounge", "-v", "xPaw"]);
			test("MODE #thelounge +o-o xPaw Max-P", ["#thelounge", "+o-o", "xPaw", "Max-P"]);
			test("MODE #thelounge", ["#thelounge"]);
		});

		it("should assume target if none given", function () {
			ModeCommand.input(testableNetwork, channel, "mode", []);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge");

			ModeCommand.input(testableNetwork, lobby, "mode", []);
			expect(testableNetwork.lastCommand).to.equal("MODE xPaw");

			ModeCommand.input(testableNetwork, channel, "mode", ["+b"]);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge +b");

			ModeCommand.input(testableNetwork, lobby, "mode", ["+b"]);
			expect(testableNetwork.lastCommand).to.equal("MODE xPaw +b");

			ModeCommand.input(testableNetwork, channel, "mode", ["-o", "hey"]);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge -o hey");

			ModeCommand.input(testableNetwork, lobby, "mode", ["-i", "idk"]);
			expect(testableNetwork.lastCommand).to.equal("MODE xPaw -i idk");
		});

		it("should support shorthand commands", function () {
			ModeCommand.input(testableNetwork, channel, "op", ["xPaw"]);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge +o xPaw");

			ModeCommand.input(testableNetwork, channel, "deop", ["xPaw"]);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge -o xPaw");

			ModeCommand.input(testableNetwork, channel, "hop", ["xPaw"]);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge +h xPaw");

			ModeCommand.input(testableNetwork, channel, "dehop", ["xPaw"]);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge -h xPaw");

			ModeCommand.input(testableNetwork, channel, "voice", ["xPaw"]);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge +v xPaw");

			ModeCommand.input(testableNetwork, channel, "devoice", ["xPaw"]);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge -v xPaw");
		});

		it("should use ISUPPORT MODES on shorthand commands", function () {
			ModeCommand.input(testableNetwork, channel, "voice", ["xPaw", "Max-P"]);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge +vv xPaw Max-P");

			// since the limit for modes on tests is 4, it should send two commands
			ModeCommand.input(testableNetwork, channel, "devoice", [
				"xPaw",
				"Max-P",
				"hey",
				"idk",
				"thelounge",
			]);
			expect(testableNetwork.firstCommand).to.equal(
				"MODE #thelounge -vvvv xPaw Max-P hey idk"
			);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge -v thelounge");
		});

		it("should fallback to all modes at once for shorthand commands", function () {
			ModeCommand.input(testableNetworkNoSupports, channel, "voice", ["xPaw"]);
			expect(testableNetworkNoSupports.lastCommand).to.equal("MODE #thelounge +v xPaw");

			ModeCommand.input(testableNetworkNoSupports, channel, "devoice", ["xPaw", "Max-P"]);
			expect(testableNetworkNoSupports.lastCommand).to.equal(
				"MODE #thelounge -vv xPaw Max-P"
			);
		});
	});
});
