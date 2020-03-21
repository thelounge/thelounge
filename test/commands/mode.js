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
			lastCommand: null,
			nick: "xPaw",
			irc: {
				raw(...args) {
					testableNetwork.lastCommand = args.join(" ");
				},
			},
		};

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

			// Multiple arguments are supported, sent as separate commands
			ModeCommand.input(testableNetwork, channel, "devoice", ["xPaw", "Max-P"]);
			expect(testableNetwork.lastCommand).to.equal("MODE #thelounge -v Max-P");
		});
	});
});
