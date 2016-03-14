var _ = require("lodash");

exports.commands = ["msg", "say"];

exports.input = function(network, chan, cmd, args) {
	if (args.length === 0 || args[0] === "") {
		return true;
	}
	var irc = network.irc;
	var target = "";
	if (cmd === "msg") {
		target = args.shift();
		if (args.length === 0) {
			return true;
		}
	} else {
		target = chan.name;
	}
	var msg = args.join(" ");
	irc.send(target, msg);
	var channel = _.find(network.channels, {name: target});
	if (typeof channel !== "undefined") {
		irc.emit("message", {
			from: irc.me,
			to: channel.name,
			message: msg
		});
	}

	return true;
};
