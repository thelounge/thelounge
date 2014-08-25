var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(network, chan, cmd, args) {
	if (cmd != "say" && cmd != "msg") {
		return;
	}
	
	if (args.length === 0 || args[0] === "") {
		return;
	}

	var client = this;
	var irc = network.irc;
	
	var target = "";
	if (cmd == "msg") {
		target = args.shift();
		if (args.length === 0) {
			return;
		}
	} else {
		target = chan.name;
	}
	
	var text = args.join(" ");
	irc.send(target, text);
	
	if (target == chan.name && typeof chan !== "undefined") {
		irc.emit("message", {
			from: irc.me,
			to: chan.name,
			message: text
		});
	}
};
