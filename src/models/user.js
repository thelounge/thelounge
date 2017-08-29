"use strict";

var _ = require("lodash");

module.exports = User;

function User(attr, prefixLookup) {
	_.defaults(this, attr, {
		modes: [],
		mode: "",
		nick: "",
		lastMessage: 0,
	});

	this.setModes(this.modes, prefixLookup);
}

User.prototype.setModes = function(modes, prefixLookup) {
	// irc-framework sets character mode, but lounge works with symbols
	this.modes = modes.map((mode) => prefixLookup[mode]);

	this.mode = this.modes[0] || "";
};

User.prototype.toJSON = function() {
	return {
		nick: this.nick,
		mode: this.mode,
		lastMessage: this.lastMessage,
	};
};
