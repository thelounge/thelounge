import Vue from "vue";
import Vuex from "vuex";
const storage = require("./localStorage");

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isConnected: false,
		isNotified: false,
		activeWindow: null,
		sessions: [],
		sidebarOpen: false,
		sidebarDragging: false,
		userlistOpen: storage.get("thelounge.state.userlist") !== "false",
	},
	mutations: {
		isConnected(state, payload) {
			state.isConnected = payload;
		},
		isNotified(state, payload) {
			state.isNotified = payload;
		},
		activeWindow(state, payload) {
			state.activeWindow = payload;
		},
		currentNetworkConfig(state, payload) {
			state.currentNetworkConfig = payload;
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
	},
	getters: {
		currentSession: (state) => state.sessions.find((item) => item.current),
		otherSessions: (state) => state.sessions.filter((item) => !item.current),
	},
});
