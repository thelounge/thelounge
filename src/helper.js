var path = require("path");
var os = require("os");

module.exports = {
	HOME: (process.env.HOME || process.env.USERPROFILE) + "/.lounge",
	getConfig: getConfig,
	expandHome: expandHome,
};

function getConfig() {
	return require(path.resolve(this.HOME) + "/config");
}

function expandHome(path) {
	var home;

	if (os.homedir) {
		home = os.homedir();
	}

	if (!home) {
		home = process.env.HOME || "";
	}

	home = home.replace("$", "$$$$");

	return path.replace(/^~($|\/|\\)/, home + "$1");
}

