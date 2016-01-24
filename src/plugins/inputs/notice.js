var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(network, chan, cmd, args) {
	if (cmd !== "notice" || !args[1]) {
		return;
	}

	var message = args.slice(1).join(" ");
	var irc = network.irc;
	irc.notice(args[0], message);

	var targetChan = _.findWhere(network.channels, {name: args[0]});
	if (typeof targetChan === "undefined") {
		message = "{to " + args[0] + "} " + message;
		targetChan = chan;
	}

	var msg = new Msg({
		type: Msg.Type.NOTICE,
		mode: targetChan.getMode(irc.me),
		from: irc.me,
		text: message
	});
	targetChan.messages.push(msg);
	this.emit("msg", {
		chan: targetChan.id,
		msg: msg
	});
};
