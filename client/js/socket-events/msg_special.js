"use strict";

const socket = require("../socket");
const {vueApp} = require("../vue");
const store = require("../store").default;

socket.on("msg:special", function(data) {
	const channel = store.getters.findChannel(data.chan);
	channel.channel.data = data.data;
	vueApp.switchToChannel(channel.channel);
});
