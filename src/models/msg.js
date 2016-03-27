var _ = require("lodash");

Msg.Type = {
	ACTION: "action",
	ERROR: "error",
	INVITE: "invite",
	JOIN: "join",
	KICK: "kick",
	MESSAGE: "message",
	MODE: "mode",
	MOTD: "motd",
	NICK: "nick",
	NOTICE: "notice",
	PART: "part",
	QUIT: "quit",
	TOGGLE: "toggle",
	CTCP: "ctcp",
	TOPIC: "topic",
	TOPIC_SET_BY: "topic_set_by",
	WHOIS: "whois"
};

module.exports = Msg;

var id = 0;

function Msg(attr) {
	_.merge(this, _.extend({
		from: "",
		id: id++,
		text: "",
		type: Msg.Type.MESSAGE,
		self: false
	}, attr));

	if (this.time > 0) {
		this.time = new Date(this.time);
	} else {
		this.time = new Date();
	}
}
