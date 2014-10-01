var fs = require("fs");
var path = require("path");
var program = require("commander");
var mkdirp = require("mkdirp");
var child = require("child_process");
var Helper = require("../helper");

var CONFIG_PATH = process.env.SHOUT_CONFIG;
if (!CONFIG_PATH) {
	CONFIG_PATH = Helper.resolveHomePath("config.js");
}
if (!fs.existsSync(CONFIG_PATH)) {
	mkdirp.sync(Helper.getHomeDirectory());
	var configFile = fs.readFileSync(path.resolve(__dirname, "..", "..", "config.js"));
	fs.writeFileSync(CONFIG_PATH, configFile);
}

program
	.command("config")
	.description("Edit config: '" + CONFIG_PATH + "'")
	.action(function() {
		child.spawn(
			"vi",
			[CONFIG_PATH],
			{stdio: "inherit"}
		);
	});
