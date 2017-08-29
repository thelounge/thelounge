"use strict";

var _ = require("lodash");

var id = 0;

class Msg {
	constructor(attr) {
		_.defaults(this, attr, {
			from: "",
			id: id++,
			previews: [],
			text: "",
			type: Msg.Type.MESSAGE,
			self: false
		});

		if (this.time > 0) {
			this.time = new Date(this.time);
		} else {
			this.time = new Date();
		}
	}

	findPreview(link) {
		return this.previews.find((preview) => preview.link === link);
	}
}

Msg.Type = {
	UNHANDLED: "unhandled",
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
	CTCP: "ctcp",
	TOPIC: "topic",
	TOPIC_SET_BY: "topic_set_by",
	WHOIS: "whois",
	BANLIST: "ban_list"
};

module.exports = Msg;
