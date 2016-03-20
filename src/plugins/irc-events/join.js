var Chan = require("../../models/chan");
var Msg = require("../../models/msg");
var User = require("../../models/user");

module.exports = function(irc, network) {
	var client = this;
	irc.on("join", function(data) {
		var chan = network.getChannel(data.channel);
		if (typeof chan === "undefined") {
			chan = new Chan({
				name: data.channel
			});
			network.channels.push(chan);
			client.save();
			client.emit("join", {
				network: network.id,
				chan: chan
			});
		}
		chan.users.push(new User({nick: data.nick, modes: ""}));
		chan.sortUsers(irc);
		client.emit("users", {
			chan: chan.id
		});
		var msg = new Msg({
			time: data.time,
			from: data.nick,
			hostmask: data.ident + "@" + data.hostname,
			type: Msg.Type.JOIN,
			self: data.nick === irc.user.nick
		});
		chan.messages.push(msg);
		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	});
};
