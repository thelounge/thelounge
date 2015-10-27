var pkg = require(process.cwd() + "/package.json");

module.exports = function(irc/* , network */) {
	irc.on("message", function(data) {
		if (data.message.indexOf("\001") !== 0) {
			return;
		}
		var msg = data.message.replace(/\001/g, "");
		var split = msg.split(" ");
		switch (split[0]) {
		case "VERSION":
			irc.ctcp(
				data.from,
				"VERSION " + pkg.name + " " + pkg.version
			);
			break;
		case "PING":
			if (split.length === 2) {
				irc.ctcp(data.from, "PING " + split[1]);
			}
			break;
		}
	});
};
