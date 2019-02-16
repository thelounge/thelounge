"use strict";

const socket = require("../socket");
const {findChannel} = require("../vue");

socket.on("msg:special", function(data) {
	findChannel(data.chan).channel.data = data.data;
});
