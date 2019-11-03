import Vue from "vue";
import Vuex from "vuex";
const storage = require("./localStorage");

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		activeChannel: null,
		currentUserVisibleError: null,
		desktopNotificationState: "unsupported",
		isAutoCompleting: false,
		isConnected: false,
		isFileUploadEnabled: false,
		isNotified: false,
		activeWindow: null,
		networks: [],
		pushNotificationState: "unsupported",
		serverConfiguration: {},
		sessions: [],
		sidebarOpen: false,
		sidebarDragging: false,
		userlistOpen: storage.get("thelounge.state.userlist") !== "false",
		versionData: null,
		versionStatus: "loading",
		versionDataExpired: false,
	},
	mutations: {
		activeChannel(state, channel) {
			state.activeChannel = channel;
		},
		currentUserVisibleError(state, error) {
			state.currentUserVisibleError = error;
		},
		desktopNotificationState(state, desktopNotificationState) {
			state.desktopNotificationState = desktopNotificationState;
		},
		isAutoCompleting(state, isAutoCompleting) {
			state.isAutoCompleting = isAutoCompleting;
		},
		isConnected(state, payload) {
			state.isConnected = payload;
		},
		isFileUploadEnabled(state, isFileUploadEnabled) {
			state.isFileUploadEnabled = isFileUploadEnabled;
		},
		isNotified(state, payload) {
			state.isNotified = payload;
		},
		activeWindow(state, payload) {
			state.activeWindow = payload;
		},
		networks(state, networks) {
			state.networks = networks;
		},
		removeNetwork(state, networkId) {
			state.networks.splice(store.state.networks.findIndex((n) => n.uuid === networkId), 1);
		},
		sortNetworks(state, sortFn) {
			state.networks.sort(sortFn);
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
	},
	getters: {
		currentSession: (state) => state.sessions.find((item) => item.current),
		otherSessions: (state) => state.sessions.filter((item) => !item.current),
		findChannelOnCurrentNetwork: (state) => (name) => {
			name = name.toLowerCase();
			return state.activeChannel.network.channels.find((c) => c.name.toLowerCase() === name);
		},
	},
});

export default store;
