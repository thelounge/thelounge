"use strict";

const commands = [
	"/away",
	"/back",
	"/ban",
	"/banlist",
	"/close",
	"/connect",
	"/deop",
	"/devoice",
	"/disconnect",
	"/invite",
	"/join",
	"/kick",
	"/leave",
	"/me",
	"/mode",
	"/msg",
	"/nick",
	"/notice",
	"/op",
	"/part",
	"/query",
	"/quit",
	"/raw",
	"/say",
	"/send",
	"/server",
	"/slap",
	"/topic",
	"/unban",
	"/voice",
	"/whois"
];

var handledTypes = [
	"ban_list",
	"invite",
	"join",
	"mode",
	"kick",
	"nick",
	"part",
	"quit",
	"topic",
	"topic_set_by",
	"action",
	"whois",
	"ctcp",
	"channel_list",
];
var condensedTypes = [
	"join",
	"mode",
	"nick",
	"part",
	"quit",
];

module.exports = {
	commands,
	condensedTypes,
	handledTypes
};
