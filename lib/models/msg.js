var _ = require("lodash");
var moment = require("moment");

Msg.Type = {
	ERROR: "error",
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
		type: Msg.Type.MESSAGE,
		time: moment().format("HH:mm"),
		from: "",
		text: ""
	}, attr));
}
