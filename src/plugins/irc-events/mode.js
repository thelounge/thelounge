var _ = require("lodash");
var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("mode", function(data) {
		var targetChan;

		if (data.target === irc.user.nick) {
			targetChan = network.channels[0];
		} else {
			targetChan = _.find(network.channels, {name: data.target});
			if (typeof targetChan === "undefined") {
				return;
			}
		}

		for (var i = 0; i < data.modes.length; i++) {
			var mode = data.modes[i];
			var text = mode.mode;
			if (mode.param) {
				text += " " + mode.param;
			}

			var msg = new Msg({
				time: data.time,
				type: Msg.Type.MODE,
				mode: (targetChan.type !== Chan.Type.LOBBY && targetChan.getMode(data.nick)) || "",
				from: data.nick,
				text: text,
				self: data.nick === irc.user.nick
			});
			targetChan.messages.push(msg);
			client.emit("msg", {
				chan: targetChan.id,
				msg: msg,
			});
		}
	});
};
