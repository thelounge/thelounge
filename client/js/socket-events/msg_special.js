"use strict";

const socket = require("../socket");

socket.on("msg:special", function(data) {
	findChannel(data.chan).data = data.data;
});
