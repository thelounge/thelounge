"use strict";

const socket = require("../socket");
const store = require("../store").default;
const {switchToChannel} = require("../router");

socket.on("msg:special", function(data) {
	const channel = store.getters.findChannel(data.chan);
	channel.channel.data = data.data;
	switchToChannel(channel.channel);
});
