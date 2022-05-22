import Vue from "vue";
import Vuex, {GetterTree, Store} from "vuex";
import {createSettingsStore} from "./store-settings";
import storage from "./localStorage";
import type {ClientChan, ClientNetwork, InitClientChan} from "./types";

const appName = document.title;

Vue.use(Vuex);

function detectDesktopNotificationState() {
	if (!("Notification" in window)) {
		return "unsupported";
	} else if (Notification.permission === "granted") {
		return "granted";
	} else if (!window.isSecureContext) {
		return "nohttps";
	}

	return "blocked";
}

export interface State {
	appLoaded: boolean;
	activeChannel: {
		network: ClientNetwork;
		channel: ClientChan;
	};
	currentUserVisibleError: string | null;
	desktopNotificationState: "granted" | "blocked" | "nohttps" | "unsupported";
	isAutoCompleting: boolean;
	isConnected: boolean;
	networks: ClientNetwork[];
	// TODO: type
	mentions: any[];
	hasServiceWorker: boolean;
	pushNotificationState: string;
	serverConfiguration: null;
	sessions: [];
	sidebarOpen: boolean;
	sidebarDragging: boolean;
	userlistOpen: boolean;
	versionData: null | {
		latest: {
			version: string;
			prerelease: boolean;
		};
	};
	versionStatus: "loading" | "new-version" | "new-packages" | "up-to-date" | "error";
	versionDataExpired: boolean;
	serverHasSettings: boolean;
	messageSearchResults: {
		results: any[];
	} | null;
	messageSearchInProgress: boolean;
	searchEnabled: boolean;
}

const store = new Store<State>({
	state: {
		appLoaded: false,
		activeChannel: {
			network: {} as ClientNetwork,
			channel: {} as ClientChan,
		},
		currentUserVisibleError: null,
		desktopNotificationState: detectDesktopNotificationState(),
		isAutoCompleting: false,
		isConnected: false,
		networks: [],
		mentions: [],
		hasServiceWorker: false,
		pushNotificationState: "unsupported",
		serverConfiguration: null,
		sessions: [],
		sidebarOpen: false,
		sidebarDragging: false,
		userlistOpen: storage.get("thelounge.state.userlist") !== "false",
		versionData: null,
		versionStatus: "loading",
		versionDataExpired: false,
		serverHasSettings: false,
		messageSearchResults: null,
		messageSearchInProgress: false,
		searchEnabled: false,
	},
	mutations: {
		appLoaded(state) {
			state.appLoaded = true;
		},
		activeChannel(state, channel) {
			state.activeChannel = channel;
		},
		currentUserVisibleError(state, error) {
			state.currentUserVisibleError = error;
		},
		refreshDesktopNotificationState(state) {
			state.desktopNotificationState = detectDesktopNotificationState();
		},
		isAutoCompleting(state, isAutoCompleting) {
			state.isAutoCompleting = isAutoCompleting;
		},
		isConnected(state, payload) {
			state.isConnected = payload;
		},
		networks(state, networks) {
			state.networks = networks;
		},
		mentions(state, mentions) {
			state.mentions = mentions;
		},
		removeNetwork(state, networkId) {
			state.networks.splice(
				store.state.networks.findIndex((n) => n.uuid === networkId),
				1
			);
		},
		sortNetworks(state, sortFn) {
			state.networks.sort(sortFn);
		},
		hasServiceWorker(state) {
			state.hasServiceWorker = true;
		},
		pushNotificationState(state, pushNotificationState) {
			state.pushNotificationState = pushNotificationState;
		},
		serverConfiguration(state, serverConfiguration) {
			state.serverConfiguration = serverConfiguration;
		},
		sessions(state, payload) {
			state.sessions = payload;
		},
		sidebarOpen(state, payload) {
			state.sidebarOpen = payload;
		},
		sidebarDragging(state, payload) {
			state.sidebarDragging = payload;
		},
		toggleSidebar(state) {
			state.sidebarOpen = !state.sidebarOpen;
		},
		toggleUserlist(state) {
			state.userlistOpen = !state.userlistOpen;
		},
		userlistOpen(state, payload) {
			state.userlistOpen = payload;
		},
		versionData(state, payload) {
			state.versionData = payload;
		},
		versionStatus(state, payload) {
			state.versionStatus = payload;
		},
		versionDataExpired(state, payload) {
			state.versionDataExpired = payload;
		},
		serverHasSettings(state, value) {
			state.serverHasSettings = value;
		},
		messageSearchInProgress(state, value) {
			state.messageSearchInProgress = value;
		},
		messageSearchResults(state, value) {
			state.messageSearchResults = value;
		},
		addMessageSearchResults(state, value) {
			// Append the search results and add networks and channels to new messages
			if (!state.messageSearchResults) {
				state.messageSearchResults = {results: []};
			}

			const results = [...state.messageSearchResults.results, ...value.results];

			state.messageSearchResults = {
				results,
			};
		},
	},
	actions: {
		partChannel({commit, state}, netChan) {
			const mentions = state.mentions.filter((msg) => !(msg.chanId === netChan.channel.id));
			commit("mentions", mentions);
		},
	},
	getters: {
		findChannelOnCurrentNetwork: (state) => (name: string) => {
			name = name.toLowerCase();
			return state.activeChannel?.network.channels.find((c) => c.name.toLowerCase() === name);
		},
		findChannelOnNetwork: (state) => (networkUuid: string, channelName: string) => {
			for (const network of state.networks) {
				if (network.uuid !== networkUuid) {
					continue;
				}

				for (const channel of network.channels) {
					if (channel.name === channelName) {
						return {network, channel};
					}
				}
			}

			return null;
		},
		findChannel: (state) => (id: number) => {
			for (const network of state.networks) {
				for (const channel of network.channels) {
					if (channel.id === id) {
						return {network, channel};
					}
				}
			}

			return null;
		},
		findNetwork: (state) => (uuid: string) => {
			for (const network of state.networks) {
				if (network.uuid === uuid) {
					return network;
				}
			}

			return null;
		},
		highlightCount(state) {
			let highlightCount = 0;

			for (const network of state.networks) {
				for (const channel of network.channels) {
					if (channel.muted) {
						continue;
					}

					highlightCount += channel.highlight;
				}
			}

			return highlightCount;
		},
		// TODO: type
		title(state, getters) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			const alertEventCount = getters?.highlightCount ? `(${getters.highlightCount}) ` : "";

			const channelname = state.activeChannel ? `${state.activeChannel.channel.name} — ` : "";

			return alertEventCount + channelname + appName;
		},
		initChannel: () => (channel: InitClientChan) => {
			// TODO: This should be a mutation
			channel.pendingMessage = "";
			channel.inputHistoryPosition = 0;

			channel.inputHistory = [""].concat(
				channel.messages
					.filter((m) => m.self && m.text && m.type === "message")
					.map((m) => m.text)
					.reverse()
					.slice(0, 99)
			);
			channel.historyLoading = false;
			channel.scrolledToBottom = true;
			channel.editTopic = false;

			channel.moreHistoryAvailable = channel.totalMessages! > channel.messages.length;
			delete channel.totalMessages;

			if (channel.type === "channel") {
				channel.usersOutdated = true;
			}

			return channel as ClientChan;
		},
	},
});

// Settings module is registered dynamically because it benefits
// from a direct reference to the store
store.registerModule("settings", createSettingsStore(store));

export default store;
