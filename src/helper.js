var path = require("path");
var os = require("os");

var HOME = expandHome("~/.lounge");

module.exports = {
	HOME: HOME,
	CONFIG_PATH: path.join(HOME, "config.js"),
	USERS_PATH: path.join(HOME, "users"),
	expandHome: expandHome,
	getConfig: getConfig,
	getUserConfigPath: getUserConfigPath,
};

function getUserConfigPath(name) {
	return path.join(this.USERS_PATH, name + ".json");
}

function getConfig() {
	return require(this.CONFIG_PATH);
}

function expandHome(shortenedPath) {
	var home;

	if (os.homedir) {
		home = os.homedir();
	}

	if (!home) {
		home = process.env.HOME || "";
	}

	home = home.replace("$", "$$$$");

	return path.resolve(shortenedPath.replace(/^~($|\/|\\)/, home + "$1"));
}
