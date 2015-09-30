var _ = require("lodash");

module.exports = function(network, chan, cmd, args) {
	if (cmd !== "ns" && cmd !== "cs" && cmd !== "hs") {
		return;
	}
	var target = ({
		"ns": "nickserv",
		"cs": "chanserv",
		"hs": "hostserv",
	})[cmd];
	if (!target || args.length === 0 || args[0] === "") {
		return;
	}
	var irc = network.irc;
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
};
