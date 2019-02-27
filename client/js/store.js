import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isConnected: false,
		isNotified: false,
	},
	mutations: {
		isConnected(state, payload) {
			state.isConnected = payload;
		},
		isNotified(state, payload) {
			state.isNotified = payload;
		},
	}
});
