var spawn = require("child_process").execSync;
var commands = [];
var status = false;

// Parse commands
(function() {
	var parts = [];

	for (var i = 2; i < process.argv.length; i++) {
		var arg = process.argv[i];

		if (arg === "\\+") {
			parts.push("+");
		}
		else if (arg === "+") {
			commands.push(parts.join(" "));
			parts = [];
		}
		else {
			parts.push(arg);
		}
	}

	if (parts.length > 0) {
		commands.push(parts.join(" "));
	}
})();

commands.forEach(function(cmd) {
	try {
		console.log(">>", cmd);
		spawn(cmd, {stdio: "inherit"});
	}
	catch (e) {
		status = e.status;
	}
});

process.exit(status);
