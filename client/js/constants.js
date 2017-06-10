"use strict";

const colorCodeMap = [
	["00", "White"],
	["01", "Black"],
	["02", "Blue"],
	["03", "Green"],
	["04", "Red"],
	["05", "Brown"],
	["06", "Magenta"],
	["07", "Orange"],
	["08", "Yellow"],
	["09", "Light Green"],
	["10", "Cyan"],
	["11", "Light Cyan"],
	["12", "Light Blue"],
	["13", "Pink"],
	["14", "Grey"],
	["15", "Light Grey"],
];

const commands = [
	"/away",
	"/back",
	"/ban",
	"/banlist",
	"/close",
	"/connect",
	"/ctcp",
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

const timeFormats = {
	msgDefault: "HH:mm",
	msgWithSeconds: "HH:mm:ss"
};

module.exports = {
	colorCodeMap: colorCodeMap,
	timeFormats: timeFormats,
	commands: commands
};
