"use strict";

const EventEmitter = require("events").EventEmitter;
const util = require("util");
const _ = require("lodash");
const express = require("express");
const Network = require("../src/models/network");
const Chan = require("../src/models/chan");

function MockClient() {
	this.config = {
		browser: {},
	};
}

util.inherits(MockClient, EventEmitter);

MockClient.prototype.createMessage = function (opts) {
	const message = _.extend(
		{
			text: "dummy message",
			nick: "test-user",
			target: "#test-channel",
			previews: [],
		},
		opts
	);

	return message;
};

function sanitizeLog(callback) {
	return function (...args) {
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

module.exports = {
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
