module.exports = function(network, chan, cmd, args) {
	if (cmd != "mode" && cmd != "op" && cmd != "voice" && cmd != "deop" && cmd != "devoice") {
		return;
	} else if (args.length === 0) {
		return;
	}
	
	var mode;
	var user;
	if (cmd != "mode") {
		user = args[0];
		mode = {
		     "op": "+o",
		  "voice": "+v",
		   "deop": "-o",
		"devoice": "-v"
		}[cmd];
	} else if (args.length === 1) {
		return;
	} else {
		mode = args[0];
		user = args[1];
	}
	var irc = network.irc;
	irc.mode(
		chan.name,
		mode,
		user
	);
};
