var _ = require("lodash");

<<<<<<< fbbb3d20d287243d2c3c5525d86801f54f903603
exports.commands = ["msg", "say"];

exports.input = function(network, chan, cmd, args) {
=======
module.exports = function(network, chan, cmd, args) {
	if (cmd !== "say" && cmd !== "msg") {
		return;
	}

>>>>>>> Update commands
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
	irc.say(target, msg);

	var channel = _.find(network.channels, {name: target});
	if (typeof channel !== "undefined") {
		irc.emit("privmsg", {
			nick: irc.user.nick,
			target: channel.name,
			msg: msg
		});
	}

	return true;
};
