"use strict";

const socket = require("../socket");
const store = require("../store").default;

socket.on("sessions:list", function(data) {
	data.sort((a, b) => b.lastUse - a.lastUse);
	store.commit("sessions", data);
});
