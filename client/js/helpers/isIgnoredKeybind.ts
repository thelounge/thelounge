"use strict";

export default (event) => {
	if (event.target.tagName !== "TEXTAREA" && event.target.tagName !== "INPUT") {
		return false;
	}

	// If focus is in a textarea, do not handle keybinds if user has typed anything
	// This is done to prevent keyboard layout binds conflicting with ours
	// For example alt+shift+left on macos selects a word
	return !!event.target.value;
};
