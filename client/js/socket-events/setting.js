"use strict";

const socket = require("../socket");
const options = require("../options");

function evaluateSetting(name, value) {
	if (options.settings.syncSettings && options.settings[name] !== value && !options.noSync.includes(name)) {
		options.processSetting(name, value, true);
	} else if (options.alwaysSync.includes(name)) {
		options.processSetting(name, value, true);
	}
}

socket.on("setting:new", function(data) {
	const name = data.name;
	const value = data.value;
	evaluateSetting(name, value);
});

socket.on("setting:all", function(settings) {
	if (Object.keys(settings).length === 0) {
		options.noServerSettings();
	} else {
		for (const name in settings) {
			evaluateSetting(name, settings[name]);
		}
	}
});
