var EventEmitter = require("events").EventEmitter;
var util = require("util");

function Settings(def) {
	var self = this;
	EventEmitter.call(this);

	this.options = def || {};

	this.on("change", function(key, value) {
		self.emit("change:" + key, value, key);
	});
	this.on("unset", function(key) {
		self.emit("unset:" + key, key);
	});
}

util.inherits(Settings, EventEmitter);

Settings.prototype.get = function(key, def) {
	if (key in this.options) {
		return this.options[key];
	}
	else {
		return def;
	}
};

Settings.prototype.set = function(key, value) {
	this.options[key] = value;
	this.emit("change", key, value);
};

Settings.prototype.unset = function(key) {
	delete this.options[key];
	this.emit("unset", key);
};

Settings.prototype.merge = function(data) {
	// Remove all gone settings
	for (var key in this.options) {
		if (!(key in data)) {
			this.unset(key);
		}
	}

	// Apply all new options
	for (key in data) {
		this.set(key, data[key]);
	}
};

Settings.prototype.bindToClient = function(client) {
	var settings = this;
	var save = function() {};

	if (client.name) {
		save = function() {
			client.manager.updateUser(client.name, {settings: settings.options});
		};
	}

	settings.on("change", function(key, value) {
		client.emit("settings:set", {key: key, value: value});
		save();
	});

	settings.on("unset", function(key) {
		client.emit("settings:unset", {key: key});
		save();
	});
};

Settings.prototype.bindToSocket = function(socket) {
	var settings = this;

	socket.on("settings:set", function(data) {
		settings.set(data.key, data.value);
	});

	socket.on("settings:unset", function(data) {
		settings.unset(data.key);
	});
};

module.exports = Settings;
