"use strict";

var EventEmitter = require("events").EventEmitter;
var Helper = require("./helper");

function Packages() {
	EventEmitter.call(this);
	this.packages = [];
}

Packages.prototype = new EventEmitter();

Packages.prototype.forEachProp = function(prop, callback) {
	this.packages.forEach(function(pkg) {
		if (prop in pkg.exports) {
			callback(pkg.exports[prop], pkg);
		}
	});
};

var packages = module.exports = new Packages();

(function(config) {
	if ("packages" in config && config.packages instanceof Array) {
		config.packages.forEach(function(pkg) {
			packages.packages.push({
				exports: require("../packages/" + pkg),
				path: pkg,
				webroot: "packages/" + pkg + "/",
			});
		});
	}
})(Helper.config);

packages.emit("packagesLoaded");
