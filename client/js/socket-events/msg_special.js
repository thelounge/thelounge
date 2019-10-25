"use strict";

const socket = require("../socket");
const {vueApp, findChannel} = require("../vue");

socket.on("msg:special", function(data) {
	const channel = findChannel(data.chan);
	channel.channel.data = data.data;
	vueApp.switchToChannel(channel.channel);
});
