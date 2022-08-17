import _ from "lodash";
import express from "express";
import Network from "../server/models/network";
import Chan from "../server/models/chan";
import {EventEmitter} from "events";
import {Message} from "../server/models/msg";

class MockClient extends EventEmitter {
	config: {
		browser: any;
	};

	constructor() {
		super();

		this.config = {
			browser: {},
		};
	}

	createMessage(opts: any) {
		const message = _.extend(
			{
				text: "dummy message",
				nick: "test-user",
				target: "#test-channel",
				previews: [],
			},
			opts
		) as Message;

		return message;
	}
}

function sanitizeLog(callback: (log: string) => void) {
	return function (...args: string[]) {
		// Concats and removes ANSI colors. See https://stackoverflow.com/a/29497680
		const stdout = args
			.join(" ")
			.replace(
				/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
				""
			);

		callback(stdout + "\n");
	};
}

export default {
	createClient() {
		return new MockClient();
	},
	createNetwork() {
		return new Network({
			host: "example.com",
			channels: [
				new Chan({
					name: "#test-channel",
				}),
			],
		});
	},
	createWebserver() {
		return express();
	},
	sanitizeLog,
	isRunningOnCI() {
		return process.env.CI || process.env.GITHUB_ACTIONS;
	},
};
