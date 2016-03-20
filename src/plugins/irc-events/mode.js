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
			targetChan = network.getChannel(data.target);
			if (typeof targetChan === "undefined") {
				return;
			}
		}

		var usersUpdated;

		for (var i = 0; i < data.modes.length; i++) {
			var mode = data.modes[i];
			var text = mode.mode;
			if (mode.param) {
				text += " " + mode.param;

				var user = _.find(targetChan.users, {name: mode.param});
				if (typeof user !== "undefined") {
					usersUpdated = true;
				}
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

		if (usersUpdated) {
			// TODO: This is horrible
			irc.raw("NAMES", data.target);
		}
	});
};
