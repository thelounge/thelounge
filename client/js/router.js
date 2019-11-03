"use strict";

const Vue = require("vue").default;
const VueRouter = require("vue-router").default;
Vue.use(VueRouter);

const store = require("./store").default;

const SignIn = require("../components/Windows/SignIn.vue").default;
const Connect = require("../components/Windows/Connect.vue").default;
const Settings = require("../components/Windows/Settings.vue").default;
const Help = require("../components/Windows/Help.vue").default;
const Changelog = require("../components/Windows/Changelog.vue").default;
const NetworkEdit = require("../components/Windows/NetworkEdit.vue").default;
const RoutedChat = require("../components/RoutedChat.vue").default;

const router = new VueRouter({
	routes: [
		{
			name: "SignIn",
			path: "/sign-in",
			component: SignIn,
		},
	],
});

router.afterEach((to) => {
	if (router.app.initialized) {
		router.app.closeSidebarIfNeeded();
	}

	if (to.name !== "RoutedChat") {
		// Navigating out of a chat window
		store.commit("activeWindow", to.name);

		if (store.state.activeChannel && store.state.activeChannel.channel) {
			router.app.switchOutOfChannel(store.state.activeChannel.channel);
		}

		store.commit("activeChannel", null);
	}
});

function initialize() {
	router.addRoutes([
		{
			name: "Connect",
			path: "/connect",
			component: Connect,
		},
		{
			name: "Settings",
			path: "/settings",
			component: Settings,
		},
		{
			name: "Help",
			path: "/help",
			component: Help,
		},
		{
			name: "Changelog",
			path: "/changelog",
			component: Changelog,
		},
		{
			name: "NetworkEdit",
			path: "/edit-network/:uuid",
			component: NetworkEdit,
		},
		{
			name: "RoutedChat",
			path: "/chan-*",
			component: RoutedChat,
		},
	]);
}

module.exports = {
	initialize,
	router,
};
