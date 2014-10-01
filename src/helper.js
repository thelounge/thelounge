var fs = require("fs");
var path = require("path");

var Helper = module.exports = {
	getConfig: function () {
		var filename = process.env.SHOUT_CONFIG;
		if(!filename || !fs.existsSync(filename)) {
			filename = this.resolveHomePath("config.js");
			if(!fs.existsSync(filename)) {
				filename = path.resolve(__dirname, "..", "config");
			}
		}
		return require(filename);
	},

	getHomeDirectory: function () {
		return (
			(process.env.SHOUT_CONFIG && fs.existsSync(process.env.SHOUT_CONFIG) && this.getConfig().home)
			|| process.env.SHOUT_HOME
			|| path.resolve(process.env.HOME, ".shout")
		);
	},

	resolveHomePath: function () {
		var fragments = [ Helper.HOME ].concat([].slice.apply(arguments));
		return path.resolve.apply(path, fragments);
	}
};

Helper.HOME = Helper.getHomeDirectory()
