import socket from "./socket";
import {TypedStore} from "./store";

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
		apply(store, value, auto = false) {
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
			// TODO: investigate ignores
			// @ts-ignore
			store.commit("refreshDesktopNotificationState", null, {root: true});

			if ("Notification" in window && value && Notification.permission !== "granted") {
				Notification.requestPermission(() =>
					// @ts-ignore
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
			const themeEl = document.getElementById("theme") as any;
			const themeUrl = `themes/${value}.css`;

			if (themeEl?.attributes.href.value === themeUrl) {
				return;
			}

			themeEl.attributes.href.value = themeUrl;

			if (!store.state.serverConfiguration) {
				return;
			}

			const newTheme = store.state.serverConfiguration?.themes.filter(
				(theme) => theme.name === value
			)[0];

			const metaSelector = document.querySelector('meta[name="theme-color"]');

			if (metaSelector) {
				const themeColor = newTheme.themeColor || (metaSelector as any).content;
				(metaSelector as any).content = themeColor;
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
		apply(store, value) {
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
