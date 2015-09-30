var Msg = require("../../models/msg");

module.exports = function(network, chan, cmd, args) {
	if (cmd !== "slap" && cmd !== "me") {
		return;
	}

	var client = this;
	var irc = network.irc;

	switch (cmd) {
	case "slap":
		var slap = "slaps " + args[0] + " around a bit with a large trout";
		/* fall through */
	case "me":
		if (args.length === 0) {
			break;
		}

		var text = slap || args.join(" ");
		irc.action(
			chan.name,
			text
		);

		var msg = new Msg({
			type: Msg.Type.ACTION,
			from: irc.me,
			text: text
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
		break;
	}
};
