"use strict";

const socket = require("../socket");
const {vueApp, findChannel} = require("../vue");

socket.on("msg:special", function(data) {
	findChannel(data.chan).channel.data = data.data;
	vueApp.$router.push("chan-" + data.chan);
});
