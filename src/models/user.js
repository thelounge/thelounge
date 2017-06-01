"use strict";

var _ = require("lodash");

module.exports = User;

function User(attr, prefixLookup) {
	_.defaults(this, attr, {
		modes: [],
		mode: "",
		nick: ""
	});

	// irc-framework sets character mode, but lounge works with symbols
	this.modes = this.modes.map(mode => prefixLookup[mode]);

	if (this.modes[0]) {
		this.mode = this.modes[0];
	}
}

User.prototype.toJSON = function() {
	return {
		nick: this.nick,
		mode: this.mode,
	};
};
