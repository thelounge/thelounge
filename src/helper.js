module.exports = {
	HOME: process.env.HOME + "/.shout",
	getConfig: getConfig
};

function getConfig() {
	return require(this.HOME + "/config.js");
};
