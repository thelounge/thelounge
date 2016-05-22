var path = require("path");
var os = require("os");

var Helper = {
	expandHome: expandHome,
	getConfig: getConfig,
	getUserConfigPath: getUserConfigPath,
	getUserLogsPath: getUserLogsPath,
	setHome: setHome,
};

module.exports = Helper;

function setHome(homePath) {
	this.HOME = expandHome(homePath || "~/.lounge");
	this.CONFIG_PATH = path.join(this.HOME, "config.js");
	this.USERS_PATH = path.join(this.HOME, "users");
}

function getUserConfigPath(name) {
	return path.join(this.USERS_PATH, name + ".json");
}

function getUserLogsPath(name, network) {
	return path.join(this.HOME, "logs", name, network);
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
