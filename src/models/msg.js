var _ = require("lodash");
var moment = require("moment");

Msg.Type = {
	ACTION: "action",
	ERROR: "error",
	IMAGE: "image",
	JOIN: "join",
	KICK: "kick",
	MESSAGE: "message",
	MODE: "mode",
	MOTD: "motd",
	NICK: "nick",
	NOTICE: "notice",
	PART: "part",
	QUIT: "quit",
	TOPIC: "topic",
	WHOIS: "whois"
};

module.exports = Msg;

function Msg(attr) {
	_.merge(this, _.extend({
		from: "",
		text: "",
		time: moment().utc().format("HH:mm:ss"),
		type: Msg.Type.MESSAGE,
		self: false
	}, attr));
}
