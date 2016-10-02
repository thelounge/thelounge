var _ = require("lodash");

module.exports = User;

function User(attr, prefixLookup) {
	_.defaults(this, attr, {
		modes: [],
		nick: ""
	});

	// irc-framework sets character mode, but lounge works with symbols
	this.modes = this.modes.map(mode => prefixLookup[mode]);

	// TODO: Remove this
	this.name = this.nick;
	this.mode = (this.modes && this.modes[0]) || "";
}
