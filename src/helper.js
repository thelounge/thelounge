module.exports = {
	HOME: (process.env.HOME || process.env.USERPROFILE) + "/.shout",
	getConfig: getConfig
};

function getConfig() {
	return require(this.HOME + "/config.js");
};
