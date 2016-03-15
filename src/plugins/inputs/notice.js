var _ = require("lodash");

exports.commands = ["notice"];

exports.input = function(network, chan, cmd, args) {
	if (!args[1]) {
		return;
	}

	var message = args.slice(1).join(" ");
	var irc = network.irc;
	irc.notice(args[0], message);

	var targetChan = _.find(network.channels, {name: args[0]});
	if (typeof targetChan === "undefined") {
		message = "{to " + args[0] + "} " + message;
		targetChan = chan;
	}

	irc.emit("notice", {
		nick: irc.user.nick,
		target: targetChan.name,
		message: message
	});

	return true;
};
