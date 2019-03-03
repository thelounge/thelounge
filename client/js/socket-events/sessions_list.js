"use strict";
const socket = require("../socket");
const {vueApp} = require("../vue");

socket.on("sessions:list", function(data) {
	data.sort((a, b) => b.lastUse - a.lastUse);
	vueApp.$store.commit("sessions", data);
});
