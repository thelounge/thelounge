"use strict";

const _ = require("lodash");

class Msg {
	constructor(attr) {
		// Some properties need to be copied in the Msg object instead of referenced
		if (attr) {
			["from", "target"].forEach((prop) => {
				if (attr[prop]) {
					this[prop] = {
						mode: attr[prop].mode,
						nick: attr[prop].nick,
					};
				}
			});
		}

		_.defaults(this, attr, {
			from: {},
			id: 0,
			previews: [],
			text: "",
			type: Msg.Type.MESSAGE,
			self: false,
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

	isLoggable() {
		if (this.type === Msg.Type.TOPIC) {
			// Do not log topic that is sent on channel join
			return !!this.from.nick;
		}

		return this.type !== Msg.Type.MOTD &&
			this.type !== Msg.Type.ERROR &&
			this.type !== Msg.Type.TOPIC_SET_BY &&
			this.type !== Msg.Type.WHOIS;
	}
}

Msg.Type = {
	UNHANDLED: "unhandled",
	AWAY: "away",
	ACTION: "action",
	BACK: "back",
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
	CTCP_REQUEST: "ctcp_request",
	CHGHOST: "chghost",
	TOPIC: "topic",
	TOPIC_SET_BY: "topic_set_by",
	WHOIS: "whois",
};

module.exports = Msg;
