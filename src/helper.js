var path = require("path");

var Helper = module.exports = {
  getConfig: function () {
    return require(path.resolve(__dirname, "..", "config.json"));
  },

  getHomeDirectory: function () {
    return (
      this.getConfig().home ||
      process.env.SHOUT_HOME ||
      path.resolve(process.env.HOME, ".shout")
    );
  },

  resolveHomePath: function () {
    var fragments = [ Helper.HOME ].concat([].slice.apply(arguments));
    return path.resolve.apply(path, fragments);
  }
};

Helper.HOME = Helper.getHomeDirectory()
