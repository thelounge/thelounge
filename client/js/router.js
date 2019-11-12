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
const constants = require("./constants");

const router = new VueRouter({
	routes: [
		{
			name: "SignIn",
			path: "/sign-in",
			component: SignIn,
			beforeEnter(to, from, next) {
				// Prevent navigating to sign-in when already signed in
				if (store.state.appLoaded) {
					next(false);
					return;
				}

				next();
			},
		},
	],
});

router.beforeEach((to, from, next) => {
	// Disallow navigating to non-existing routes
	if (store.state.appLoaded && !to.matched.length) {
		next(false);
		return;
	}

	// Disallow navigating to invalid channels
	if (to.name === "RoutedChat" && !store.getters.findChannel(Number(to.params.id))) {
		next(false);
		return;
	}

	// Handle closing image viewer with the browser back button
	if (!router.app.$refs.app) {
		next();
		return;
	}

	const imageViewer = router.app.$root.$refs.app.$refs.imageViewer;

	if (imageViewer && imageViewer.link) {
		imageViewer.closeViewer();
		next(false);
		return;
	}

	next();
});

router.afterEach(() => {
	if (store.state.appLoaded) {
		if (window.innerWidth <= constants.mobileViewportPixels) {
			store.commit("sidebarOpen", false);
		}
	}

	if (store.state.activeChannel) {
		const channel = store.state.activeChannel.channel;
		store.commit("activeChannel", null);

		// When switching out of a channel, mark everything as read
		if (channel.messages.length > 0) {
			channel.firstUnread = channel.messages[channel.messages.length - 1].id;
		}

		if (channel.messages.length > 100) {
			channel.messages.splice(0, channel.messages.length - 100);
			channel.moreHistoryAvailable = true;
		}
	}
});

function initialize() {
	router.addRoutes([
		{
			name: "Connect",
			path: "/connect",
			component: Connect,
			props: (route) => ({queryParams: route.query}),
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
			path: "/chan-:id",
			component: RoutedChat,
		},
	]);
}

function navigate(routeName, params = {}) {
	router.push({name: routeName, params}).catch(() => {});
}

module.exports = {
	initialize,
	router,
	navigate,
	switchToChannel: (channel) => navigate("RoutedChat", {id: channel.id}),
};
