const contextMenu = require("../contextMenu");

// Our public API
window.TheLounge = {
	contextMenu: {
		addContextMenuItem: contextMenu.addContextMenuItem,
	},
};

/*
 * This stops other plugins overriding our api and forcing malicious code on another plugin.
 *
 * Remember: this won't stop plugins doing all malicious things, plugins are inherently insecure
 */
deepFreeze(window.TheLounge);

function deepFreeze(obj) {
	const propNames = Object.getOwnPropertyNames(obj);

	propNames.forEach(function(name) {
		const prop = obj[name];

		if (typeof prop === "object" && prop !== null) {
			deepFreeze(prop);
		}
	});

	return Object.freeze(obj);
}
