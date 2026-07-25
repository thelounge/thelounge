import fs from "fs";
import os from "os";
import path from "path";
import {expect} from "chai";

import Msg from "../../../server/models/msg";
import Network from "../../../server/models/network";
import Chan from "../../../server/models/chan";
import {MessageType} from "../../../shared/types/msg";
import Config from "../../../server/config";
import TextFileMessageStorage from "../../../server/plugins/messageStorage/text";

describe("TextFileMessageStorage", function () {
	let tmpHome: string;
	let originalHome: string;

	beforeEach(function () {
		tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), "tl-textstorage-"));
		originalHome = Config.getHomePath();
		Config.setHome(tmpHome);
	});

	afterEach(function () {
		Config.setHome(originalHome);
		fs.rmSync(tmpHome, {recursive: true, force: true});
	});

	function logPathFor(network: Network, channel: Chan) {
		return path.join(
			Config.getUserLogsPath(),
			"alice",
			TextFileMessageStorage.getNetworkFolderName(network),
			TextFileMessageStorage.getChannelFileName(channel)
		);
	}

	it("writes a single line for a normal message", function () {
		const storage = new TextFileMessageStorage("alice");
		storage.enable();

		const network = new Network({name: "freenode"});
		const channel = new Chan({name: "#test"});
		const msg = new Msg({
			type: MessageType.MESSAGE,
			text: "hello world",
			from: {nick: "bob", mode: ""},
			time: new Date("2026-05-01T12:00:00.000Z"),
		});

		storage.index(network, channel, msg);

		const contents = fs.readFileSync(logPathFor(network, channel), "utf8");
		expect(contents).to.equal("[2026-05-01T12:00:00.000Z] <bob> hello world\n");
	});

	it("re-prefixes continuation lines so each row stays parseable", function () {
		const storage = new TextFileMessageStorage("alice");
		storage.enable();

		const network = new Network({name: "freenode"});
		const channel = new Chan({name: "#test"});
		const msg = new Msg({
			type: MessageType.MESSAGE,
			text: "line one\nline two\nline three",
			from: {nick: "bob", mode: ""},
			time: new Date("2026-05-01T12:00:00.000Z"),
		});

		storage.index(network, channel, msg);

		const contents = fs.readFileSync(logPathFor(network, channel), "utf8");
		expect(contents).to.equal(
			"[2026-05-01T12:00:00.000Z] <bob> line one\n" +
				"[2026-05-01T12:00:00.000Z] | line two\n" +
				"[2026-05-01T12:00:00.000Z] | line three\n"
		);
	});

	it("preserves embedded newlines in ACTION messages", function () {
		const storage = new TextFileMessageStorage("alice");
		storage.enable();

		const network = new Network({name: "freenode"});
		const channel = new Chan({name: "#test"});
		const msg = new Msg({
			type: MessageType.ACTION,
			text: "first\nsecond",
			from: {nick: "bob", mode: "@"},
			time: new Date("2026-05-01T12:00:00.000Z"),
		});

		storage.index(network, channel, msg);

		const contents = fs.readFileSync(logPathFor(network, channel), "utf8");
		expect(contents).to.equal(
			"[2026-05-01T12:00:00.000Z] * @bob first\n" + "[2026-05-01T12:00:00.000Z] | second\n"
		);
	});
});
