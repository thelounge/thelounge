var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(network, chan, cmd, args) {
	if (cmd != "say" && cmd != "msg") {
		return;
	}
	
	var client = this;
	var irc = network.irc;
	
	if (args.length === 0 || args[0] == "") {
		return;
	}
	
	var target = args[0].charAt(0) == "#" ? args[0] : chan.name;
	if (target !== chan.name) {
		chan = _.findWhere(network.channels, {
			name: target
		});
	}
	
	var text = args.join(" ");
	irc.send(target, text);
	
	if (typeof chan !== "undefined") {
		var msg = new Msg({
			type: Msg.Type.MESSAGE,
			from: irc.me,
			text: text
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	}
};
