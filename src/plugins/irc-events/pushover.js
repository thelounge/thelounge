var Push = require('pushover-notifications');
var Chan = require("../../models/chan");
var Helper = require("../../helper");

module.exports = function(irc, network) {
    var client = this;

    irc.on("privmsg", function(data) {
	var config = Helper.getConfig();
	var self = data.nick === irc.user.nick;
	var highlight = false;

	if (data.from_server) {
	    return;
	}

	var target = data.target;
	if (target.toLowerCase() === irc.user.nick.toLowerCase()) {
	    target = data.nick;
	}

	chan = network.getChannel(target);
	if (chan.type === Chan.Type.QUERY) {
	    highlight = !self;
	}

	if (!highlight && !self) {
	    highlight = network.highlightRegex.test(data.message);
	}

	if (highlight && usePushover(config.pushover)) {

	    var p = new Push({
		user: config.pushover.userToken,
		token: config.pushover.appToken,
		onerror: function(error) {},
		update_sounds: true
	    });

	    var message = data.message;
	    var fromChannel = chan.type === Chan.Type.CHANNEL;

	    if (fromChannel) {
		if (message.toLowerCase().startsWith(irc.user.nick.toLowerCase())) {
		    message = message.substring(irc.user.nick.length);
		    if (message[0] === ':')
			message = message.substring(1);
		    message = message.trim();
		}
		message = data.nick + ": " + message;
	    }

	    var msg = {
		message: message,
		title: fromChannel ? "Message on " + target : "Message from " + target
	    };

	    p.send(msg, function(err, result) {
		if (err) { log.warn("Pushover: " + err) }
	    });
	}
    });
};

function usePushover(configPushover) {
    return (configPushover && configPushover.userToken.length && configPushover.appToken.length);
}
