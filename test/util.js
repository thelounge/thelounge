"use strict";

var EventEmitter = require("events").EventEmitter;
var util = require("util");
var _ = require("lodash");
var express = require("express");
var Network = require("../src/models/network");
var Chan = require("../src/models/chan");

function MockClient() {
	this.user = {nick: "test-user"};
}
util.inherits(MockClient, EventEmitter);

MockClient.prototype.createMessage = function(opts) {
	var message = _.extend({
		text: "dummy message",
		nick: "test-user",
		target: "#test-channel",
		previews: [],
	}, opts);

	return message;
};

function mockLogger(callback) {
	return function() {
		// TODO: Use ...args with The Lounge v3: add `...args` as function argument
		//       and replaced the next line with `args.join(", ")`
		const stdout = Array.prototype.slice.call(arguments).join(" ")
			.replace( // Removes ANSI colors. See https://stackoverflow.com/a/29497680
				/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
				""
			);

		callback(stdout + "\n");
	};
}

module.exports = {
	createClient: function() {
		return new MockClient();
	},
	createNetwork: function() {
		return new Network({
			host: "example.com",
			channels: [new Chan({
				name: "#test-channel",
			})],
		});
	},
	createWebserver: function() {
		return express();
	},
	mockLogger,
};
