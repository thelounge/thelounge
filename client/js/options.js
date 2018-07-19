"use strict";

const $ = require("jquery");
const escapeRegExp = require("lodash/escapeRegExp");
const storage = require("./localStorage");
const socket = require("./socket");
const {vueApp} = require("./vue");
require("../js/autocompletion");

const $windows = $("#windows");
const $settings = $("#settings");
const $theme = $("#theme");
const $userStyles = $("#user-specified-css");

const noCSSparamReg = /[?&]nocss/;

// Not yet available at this point but used in various functionaly.
// Will be assigned when `initialize` is called.
let $syncWarningOverride;
let $syncWarningBase;
let $forceSyncButton;
let $warningUnsupported;
let $warningBlocked;

// Default settings
const settings = vueApp.settings;

const noSync = ["syncSettings"];

// alwaysSync is reserved for things like "highlights".
// TODO: figure out how to deal with legacy clients that have different settings.
const alwaysSync = [];

// Process usersettings from localstorage.
let userSettings = JSON.parse(storage.get("settings")) || false;

if (!userSettings) {
	// Enable sync by default if there are no user defined settings.
	settings.syncSettings = true;
} else {
	for (const key in settings) {
		if (userSettings[key] !== undefined) {
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

if (typeof userSettings.theme === "string" && $theme.attr("href") !== `themes/${userSettings.theme}.css`) {
	$theme.attr("href", `themes/${userSettings.theme}.css`);
}

userSettings = null;

module.exports = {
	alwaysSync,
	noSync,
	initialized: false,
	highlightsRE: null,
	settings,
	shouldOpenMessagePreview,
	syncAllSettings,
	processSetting,
	initialize,
};

function shouldOpenMessagePreview(type) {
	return type === "link" ? settings.links : settings.media;
}

// Updates the checkbox and warning in settings.
// When notifications are not supported, this is never called (because
// checkbox state can not be changed).
function updateDesktopNotificationStatus() {
	if (Notification.permission === "denied") {
		$warningBlocked.show();
	} else {
		$warningBlocked.hide();
	}
}

function applySetting(name, value) {
	if (name === "syncSettings" && value) {
		$syncWarningOverride.hide();
		$forceSyncButton.hide();
	} else if (name === "theme") {
		value = `themes/${value}.css`;

		if ($theme.attr("href") !== value) {
			$theme.attr("href", value);
		}
	} else if (name === "userStyles" && !noCSSparamReg.test(window.location.search)) {
		$userStyles.html(value);
	} else if (name === "highlights") {
		let highlights;

		if (typeof value === "string") {
			highlights = value.split(",").map(function(h) {
				return h.trim();
			});
		} else {
			highlights = value;
		}

		highlights = highlights.filter(function(h) {
			// Ensure we don't have empty string in the list of highlights
			// otherwise, users get notifications for everything
			return h !== "";
		});
		// Construct regex with wordboundary for every highlight item
		const highlightsTokens = highlights.map(function(h) {
			return escapeRegExp(h);
		});

		if (highlightsTokens && highlightsTokens.length) {
			module.exports.highlightsRE = new RegExp(`(?:^| |\t)(?:${highlightsTokens.join("|")})(?:\t| |$)`, "i");
		} else {
			module.exports.highlightsRE = null;
		}
	} else if (name === "desktopNotifications") {
		if (("Notification" in window) && value && Notification.permission !== "granted") {
			Notification.requestPermission(updateDesktopNotificationStatus);
		} else if (!value) {
			$warningBlocked.hide();
		}
	} else if (name === "advanced") {
		$("#settings [data-advanced]").toggle(settings[name]);
	}
}

function settingSetEmit(name, value) {
	socket.emit("setting:set", {name, value});
}

// When sync is `true` the setting will also be send to the backend for syncing.
function updateSetting(name, value, sync) {
	let storeValue = value;

	// First convert highlights if input is a string.
	// Otherwise we are comparing the wrong types.
	if (name === "highlights" && typeof value === "string") {
		storeValue = value.split(",").map(function(h) {
			return h.trim();
		}).filter(function(h) {
			// Ensure we don't have empty string in the list of highlights
			// otherwise, users get notifications for everything
			return h !== "";
		});
	}

	const currentOption = settings[name];

	// Only update and process when the setting is actually changed.
	if (currentOption !== storeValue) {
		settings[name] = storeValue;
		storage.set("settings", JSON.stringify(settings));
		applySetting(name, value);

		// Sync is checked, request settings from server.
		if (name === "syncSettings" && value) {
			socket.emit("setting:get");
			$syncWarningOverride.hide();
			$syncWarningBase.hide();
			$forceSyncButton.hide();
		} else if (name === "syncSettings") {
			$syncWarningOverride.show();
			$forceSyncButton.show();
		}

		if (settings.syncSettings && !noSync.includes(name) && sync) {
			settingSetEmit(name, value);
		} else if (alwaysSync.includes(name) && sync) {
			settingSetEmit(name, value);
		}
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

		$syncWarningOverride.hide();
		$syncWarningBase.hide();
		$forceSyncButton.hide();
	} else {
		$syncWarningOverride.hide();
		$forceSyncButton.hide();
		$syncWarningBase.show();
	}
}

// If `save` is set to true it will pass the setting to `updateSetting()`  processSetting
function processSetting(name, value, save) {
	if (name === "userStyles") {
		$settings.find("#user-specified-css-input").val(value);
	} else if (name === "highlights") {
		$settings.find(`input[name=${name}]`).val(value);
	} else if (name === "nickPostfix") {
		$settings.find(`input[name=${name}]`).val(value);
	} else if (name === "statusMessages") {
		$settings.find(`input[name=${name}][value=${value}]`)
			.prop("checked", true);
	} else if (name === "theme") {
		$settings.find("#theme-select").val(value);
	} else if (typeof value === "boolean") {
		$settings.find(`input[name=${name}]`).prop("checked", value);
	}

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
	$warningBlocked = $settings.find("#warnBlockedDesktopNotifications");
	$warningUnsupported = $settings.find("#warnUnsupportedDesktopNotifications");

	$syncWarningOverride = $settings.find(".sync-warning-override");
	$syncWarningBase = $settings.find(".sync-warning-base");
	$forceSyncButton = $settings.find(".force-sync-button");

	$warningBlocked.hide();
	module.exports.initialized = true;

	// Settings have now entirely updated, apply settings to the client.
	for (const name in settings) {
		processSetting(name, settings[name], false);
	}

	// If browser does not support notifications
	// display proper message in settings.
	if (("Notification" in window)) {
		$warningUnsupported.hide();
		$windows.on("show", "#settings", updateDesktopNotificationStatus);
	} else {
		$warningUnsupported.show();
	}

	$settings.on("change", "input, select, textarea", function(e) {
		// We only want to trigger on human triggered changes.
		if (e.originalEvent) {
			const $self = $(this);
			const type = $self.prop("type");
			const name = $self.prop("name");

			if (type === "radio") {
				if ($self.prop("checked")) {
					updateSetting(name, $self.val(), true);
				}
			} else if (type === "checkbox") {
				updateSetting(name, $self.prop("checked"), true);
				settings[name] = $self.prop("checked");
			} else if (type !== "password") {
				updateSetting(name, $self.val(), true);
			}
		}
	});

	$settings.find("#forceSync").on("click", () => {
		syncAllSettings(true);
	});

	// Local init is done, let's sync
	// We always ask for synced settings even if it is disabled.
	// Settings can be mandatory to sync and it is used to determine sync base state.
	socket.emit("setting:get");

	// Protocol handler
	const defaultClientButton = $("#make-default-client");

	if (window.navigator.registerProtocolHandler) {
		defaultClientButton.on("click", function() {
			const uri = document.location.origin + document.location.pathname + "?uri=%s";

			window.navigator.registerProtocolHandler("irc", uri, "The Lounge");
			window.navigator.registerProtocolHandler("ircs", uri, "The Lounge");

			return false;
		});

		$("#native-app").prop("hidden", false);
	} else {
		defaultClientButton.hide();
	}
}
