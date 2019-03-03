import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isConnected: false,
		isNotified: false,
		activeWindow: null,
		sessions: [],
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
	},
	getters: {
		currentSession: (state) => state.sessions.find((item) => item.current),
		otherSessions: (state) => state.sessions.filter((item) => !item.current),
	},
});
