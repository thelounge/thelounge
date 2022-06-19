import socket from "./socket";
import type {TypedStore} from "./store";

const defaultSettingConfig = {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	apply() {},
	default: null,
	sync: null,
};

const defaultConfig = {
	syncSettings: {
		default: true,
		sync: "never",
		apply(store: TypedStore, value: boolean, auto = false) {
			// If applied by settings/applyAll, do not emit to server
			if (value && !auto) {
				socket.emit("setting:get");
			}
		},
	},
	advanced: {
		default: false,
	},
	autocomplete: {
		default: true,
	},
	nickPostfix: {
		default: "",
	},
	coloredNicks: {
		default: true,
	},
	desktopNotifications: {
		default: false,
		sync: "never",
		apply(store: TypedStore, value: boolean) {
			// Commit a mutation. options can have root: true that allows to commit root mutations in namespaced modules.
			// https://vuex.vuejs.org/api/#store-instance-methods. not typed?
			store.commit("refreshDesktopNotificationState", null, {root: true});

			if ("Notification" in window && value && Notification.permission !== "granted") {
				Notification.requestPermission(() =>
					store.commit("refreshDesktopNotificationState", null, {root: true})
				).catch((e) => {
					// eslint-disable-next-line no-console
					console.error(e);
				});
			}
		},
	},
	highlights: {
		default: "",
		sync: "always",
	},
	highlightExceptions: {
		default: "",
		sync: "always",
	},
	awayMessage: {
		default: "",
		sync: "always",
	},
	links: {
		default: true,
	},
	motd: {
		default: true,
	},
	notification: {
		default: true,
		sync: "never",
	},
	notifyAllMessages: {
		default: false,
	},
	showSeconds: {
		default: false,
	},
	use12hClock: {
		default: false,
	},
	statusMessages: {
		default: "condensed",
	},
	theme: {
		default: document.getElementById("theme")?.dataset.serverTheme,
		apply(store: TypedStore, value: string) {
			const themeEl = document.getElementById("theme");
			const themeUrl = `themes/${value}.css`;

			if (!(themeEl instanceof HTMLLinkElement)) {
				throw new Error("theme element is not a link");
			}

			const hrefAttr = themeEl.attributes.getNamedItem("href");

			if (!hrefAttr) {
				throw new Error("theme is missing href attribute");
			}

			if (hrefAttr.value === themeUrl) {
				return;
			}

			hrefAttr.value = themeUrl;

			if (!store.state.serverConfiguration) {
				return;
			}

			const newTheme = store.state.serverConfiguration?.themes.filter(
				(theme) => theme.name === value
			)[0];

			const metaSelector = document.querySelector('meta[name="theme-color"]');

			if (!(metaSelector instanceof HTMLMetaElement)) {
				throw new Error("theme meta element is not a meta element");
			}

			if (metaSelector) {
				const themeColor = newTheme.themeColor || metaSelector.content;
				metaSelector.content = themeColor;
			}
		},
	},
	media: {
		default: true,
	},
	uploadCanvas: {
		default: true,
	},
	userStyles: {
		default: "",
		apply(store: TypedStore, value: string) {
			if (!/[?&]nocss/.test(window.location.search)) {
				const element = document.getElementById("user-specified-css");

				if (element) {
					element.innerHTML = value;
				}
			}
		},
	},
	searchEnabled: {
		default: false,
	},
};

export const config = normalizeConfig(defaultConfig);

export function createState() {
	const state = {};

	for (const settingName in config) {
		state[settingName] = config[settingName].default;
	}

	return state;
}

function normalizeConfig(obj: any) {
	const newConfig: Partial<typeof defaultConfig> = {};

	for (const settingName in obj) {
		newConfig[settingName] = {...defaultSettingConfig, ...obj[settingName]};
	}

	return newConfig as typeof defaultConfig;
}

// flatten to type of default
export type SettingsState = {
	[key in keyof typeof defaultConfig]: typeof defaultConfig[key]["default"];
};
