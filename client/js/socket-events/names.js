"use strict";

const socket = require("../socket");
const render = require("../render");
const {vueApp, findChannel} = require("../vue");

socket.on("names", function(data) {
	const channel = findChannel(data.id);

	if (channel) {
		channel.channel.users = data.users;
	}
});
