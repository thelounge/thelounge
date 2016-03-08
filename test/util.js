var EventEmitter = require("events").EventEmitter;
var util = require("util");
var _ = require("lodash");
var express = require("express");

function MockClient(opts) {
	this.user = {nick: "test-user"};

	for (var k in opts) {
		this[k] = opts[k];
	}
}
util.inherits(MockClient, EventEmitter);

MockClient.prototype.createMessage = function(opts) {

	var message = _.extend({
		msg: "dummy message",
		nick: "test-user",
		target: "#test-channel"
	}, opts);

	this.emit("privmsg", message);
};

module.exports = {
	createClient: function() {
		return new MockClient();
	},
	createNetwork: function() {
		return {
			channels: [{
				name: "#test-channel",
				messages: []
			}]
		};
	},
	createWebserver: function() {
		return express();
	}
};
