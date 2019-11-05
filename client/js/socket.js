"use strict";

const io = require("socket.io-client");

const socket = io({
	transports: JSON.parse(document.body.dataset.transports),
	path: window.location.pathname + "socket.io/",
	autoConnect: false,
	reconnection: !document.body.classList.contains("public"),
});

module.exports = socket;
