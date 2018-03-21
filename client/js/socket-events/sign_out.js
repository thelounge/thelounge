"use strict";

const socket = require("../socket");
const Auth = require("../auth");

socket.on("sign-out", function() {
	Auth.signout();
});
