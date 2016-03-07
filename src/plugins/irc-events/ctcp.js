var pkg = require(process.cwd() + "/package.json");

module.exports = function(irc/* , network */) {
	irc.on("ctcp request", function(data) {
		switch (data.type) {
		case "VERSION":
			irc.ctcpResponse(data.nick, "VERSION " + pkg.name + " " + pkg.version);
			break;
		case "PING":
			var split = data.msg.split(" ");
			if (split.length === 2) {
				irc.ctcpResponse(data.nick, "PING " + split[1]);
			}
			break;
		}
	});
};
