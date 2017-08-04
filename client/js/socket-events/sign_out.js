"use strict";

const socket = require("../socket");
const storage = require("../localStorage");

socket.on("sign-out", function() {
	storage.remove("token");
	location.reload();
});
