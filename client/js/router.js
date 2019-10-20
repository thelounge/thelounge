"use strict";

const Vue = require("vue").default;
const VueRouter = require("vue-router").default;
Vue.use(VueRouter);

const SignIn = require("../components/Windows/SignIn.vue").default;
const Connect = require("../components/Windows/Connect.vue").default;
const Settings = require("../components/Windows/Settings.vue").default;
const Help = require("../components/Windows/Help.vue").default;
const Changelog = require("../components/Windows/Changelog.vue").default;
const RoutedChat = require("../components/RoutedChat.vue").default;

const router = new VueRouter({
	routes: [
		{
			path: "/sign-in",
			component: SignIn,
			meta: {
				isChat: false,
				windowName: "SignIn",
			},
		},
		{
			path: "/connect",
			component: Connect,
			meta: {
				isChat: false,
				windowName: "Connect",
			},
		},
		{
			path: "/settings",
			component: Settings,
			meta: {
				isChat: false,
				windowName: "Settings",
			},
		},
		{
			path: "/help",
			component: Help,
			meta: {
				isChat: false,
				windowName: "Help",
			},
		},
		{
			path: "/changelog",
			component: Changelog,
			meta: {
				isChat: false,
				windowName: "Changelog",
			},
		},
		{
			path: "/chan-*",
			component: RoutedChat,
			meta: {
				isChat: true,
				windowName: "RoutedChat",
			},
		},
	],
});

router.afterEach((to) => {
	if (!router.app.initialized) {
		return;
	}

	router.app.closeSidebarIfNeeded();

	if (!to.meta.isChat) {
		// Navigating out of a chat window
		router.app.$store.commit("activeWindow", to.meta.windowName);

		if (router.app.activeChannel && router.app.activeChannel.channel) {
			router.app.switchOutOfChannel(router.app.activeChannel.channel);
		}

		router.app.activeChannel = null;
	}
});

export default router;
