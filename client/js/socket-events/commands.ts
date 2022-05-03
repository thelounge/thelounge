const constants = require("../constants");
import socket from "../socket";

socket.on("commands", function (commands) {
	if (commands) {
		constants.commands = commands;
	}
});
