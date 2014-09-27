var _ = require("lodash");
var moment = require("moment");

Msg.Type = {
	ACTION: "action",
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
	TOGGLE: "toggle",
	TOPIC: "topic",
	WHOIS: "whois"
};

module.exports = Msg;

var id = 0;

function Msg(attr) {
	_.merge(this, _.extend({
		from: "",
		id: id++,
		text: "",
		time: moment().utc().format("HH:mm:ss"),
		type: Msg.Type.MESSAGE,
		self: false
	}, attr));
}
