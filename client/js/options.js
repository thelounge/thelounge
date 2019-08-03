"use strict";

const $ = require("jquery");
const storage = require("./localStorage");
const socket = require("./socket");
const {vueApp} = require("./vue");
require("../js/autocompletion");

const $theme = $("#theme");
const $userStyles = $("#user-specified-css");

const noCSSparamReg = /[?&]nocss/;

// Default settings
const settings = vueApp.settings;

const noSync = ["syncSettings"];

// alwaysSync is reserved for settings that should be synced
// to the server regardless of the clients sync setting.
const alwaysSync = ["highlights"];

const defaultThemeColor = document.querySelector('meta[name="theme-color"]').content;

// Process usersettings from localstorage.
let userSettings = JSON.parse(storage.get("settings")) || false;

if (!userSettings) {
	// Enable sync by default if there are no user defined settings.
	settings.syncSettings = true;
} else {
	for (const key in settings) {
		// Older The Lounge versions converted highlights to an array, turn it back into a string
		if (key === "highlights" && typeof userSettings[key] === "object") {
			userSettings[key] = userSettings[key].join(", ");
		}

		// Make sure the setting in local storage has the same type that the code expects
		if (
			typeof userSettings[key] !== "undefined" &&
			typeof settings[key] === typeof userSettings[key]
		) {
			settings[key] = userSettings[key];
		}
	}
}

// Apply custom CSS and themes on page load
// Done here and not on init because on slower devices and connections
// it can take up to several seconds before init is called.
if (typeof userSettings.userStyles === "string" && !noCSSparamReg.test(window.location.search)) {
	$userStyles.html(userSettings.userStyles);
}

if (
	typeof userSettings.theme === "string" &&
	$theme.attr("href") !== `themes/${userSettings.theme}.css`
) {
	$theme.attr("href", `themes/${userSettings.theme}.css`);
}

userSettings = null;

module.exports = {
	alwaysSync,
	noSync,
	initialized: false,
	settings,
	syncAllSettings,
	processSetting,
	initialize,
	updateSetting,
};

// Updates the checkbox and warning in settings.
// When notifications are not supported, this is never called (because
// checkbox state can not be changed).
function updateDesktopNotificationStatus() {
	if (Notification.permission === "granted") {
		vueApp.desktopNotificationState = "granted";
	} else {
		vueApp.desktopNotificationState = "blocked";
	}
}

function applySetting(name, value) {
	if (name === "theme") {
		const themeUrl = `themes/${value}.css`;

		if ($theme.attr("href") !== themeUrl) {
			$theme.attr("href", themeUrl);
			const newTheme = vueApp.serverConfiguration.themes.filter(
				(theme) => theme.name === value
			)[0];
			let themeColor = defaultThemeColor;

			if (newTheme.themeColor) {
				themeColor = newTheme.themeColor;
			}

			document.querySelector('meta[name="theme-color"]').content = themeColor;
		}
	} else if (name === "userStyles" && !noCSSparamReg.test(window.location.search)) {
		$userStyles.html(value);
	} else if (name === "desktopNotifications") {
		updateDesktopNotificationStatus();

		if ("Notification" in window && value && Notification.permission !== "granted") {
			Notification.requestPermission(updateDesktopNotificationStatus);
		}
	}
}

function settingSetEmit(name, value) {
	socket.emit("setting:set", {name, value});
}

// When sync is `true` the setting will also be sent to the backend for syncing.
function updateSetting(name, value, sync) {
	settings[name] = value;
	storage.set("settings", JSON.stringify(settings));
	applySetting(name, value);

	// Sync is checked, request settings from server.
	if (name === "syncSettings" && value) {
		socket.emit("setting:get");
	}

	if (settings.syncSettings && !noSync.includes(name) && sync) {
		settingSetEmit(name, value);
	} else if (alwaysSync.includes(name) && sync) {
		settingSetEmit(name, value);
	}
}

function syncAllSettings(force = false) {
	// Sync all settings if sync is enabled or force is true.
	if (settings.syncSettings || force) {
		for (const name in settings) {
			if (!noSync.includes(name)) {
				settingSetEmit(name, settings[name]);
			} else if (alwaysSync.includes(name)) {
				settingSetEmit(name, settings[name]);
			}
		}
	}
}

// If `save` is set to true it will pass the setting to `updateSetting()`  processSetting
function processSetting(name, value, save) {
	// No need to also call processSetting when `save` is true.
	// updateSetting does take care of that.
	if (save) {
		// Sync is false as applySetting is never called as the result of a user changing the setting.
		updateSetting(name, value, false);
	} else {
		applySetting(name, value);
	}
}

function initialize() {
	module.exports.initialized = true;

	// Settings have now entirely updated, apply settings to the client.
	for (const name in settings) {
		processSetting(name, settings[name], false);
	}

	// If browser does not support notifications
	// display proper message in settings.
	if ("Notification" in window) {
		updateDesktopNotificationStatus();
	} else {
		vueApp.desktopNotificationState = "unsupported";
	}

	// Local init is done, let's sync
	// We always ask for synced settings even if it is disabled.
	// Settings can be mandatory to sync and it is used to determine sync base state.
	socket.emit("setting:get");
}
