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

		switch (this.type) {
			case Msg.Type.MONOSPACE_BLOCK:
			case Msg.Type.ERROR:
			case Msg.Type.TOPIC_SET_BY:
			case Msg.Type.MODE_CHANNEL:
			case Msg.Type.MODE_USER:
			case Msg.Type.RAW:
			case Msg.Type.WHOIS:
			case Msg.Type.PLUGIN:
				return false;
			default:
				return true;
		}
	}
}

Msg.Type = {
	UNHANDLED: "unhandled",
	ACTION: "action",
	AWAY: "away",
	BACK: "back",
	ERROR: "error",
	INVITE: "invite",
	JOIN: "join",
	KICK: "kick",
	LOGIN: "login",
	LOGOUT: "logout",
	MESSAGE: "message",
	MODE: "mode",
	MODE_CHANNEL: "mode_channel",
	MODE_USER: "mode_user", // RPL_UMODEIS
	MONOSPACE_BLOCK: "monospace_block",
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
	RAW: "raw",
	PLUGIN: "plugin",
	WALLOPS: "wallops",
};

module.exports = Msg;
