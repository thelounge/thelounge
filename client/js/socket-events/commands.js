const constants = require("../constants");
const socket = require("../socket");

socket.on("commands", function(commands) {
	if (commands) {
		constants.commands = commands;
	}
});
