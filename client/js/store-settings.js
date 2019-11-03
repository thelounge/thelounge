function createMutator(propertyName) {
	return [
		propertyName,
		(state, value) => {
			state[propertyName] = value;
		},
	];
}

function createMutators(keys) {
	return Object.fromEntries(keys.map(createMutator));
}

const state = {
	syncSettings: false,
	advanced: false,
	autocomplete: true,
	nickPostfix: "",
	coloredNicks: true,
	desktopNotifications: false,
	highlights: "",
	links: true,
	motd: true,
	notification: true,
	notifyAllMessages: false,
	showSeconds: false,
	statusMessages: "condensed",
	theme: document.getElementById("theme").dataset.serverTheme,
	media: true,
	userStyles: "",
};

export default {
	namespaced: true,
	state,
	mutations: createMutators(Object.keys(state)),
};
