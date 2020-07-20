"use strict";

const constants = require("./constants");

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import SignIn from "../components/Windows/SignIn.vue";
import Connect from "../components/Windows/Connect.vue";
import Settings from "../components/Windows/Settings.vue";
import Help from "../components/Windows/Help.vue";
import Changelog from "../components/Windows/Changelog.vue";
import NetworkEdit from "../components/Windows/NetworkEdit.vue";
import RoutedChat from "../components/RoutedChat.vue";
import store from "./store";

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
	],
});

router.beforeEach((to, from, next) => {
	// If user is not yet signed in, wait for appLoaded state to change
	// unless they are trying to open SignIn (which can be triggered in auth.js)
	if (!store.state.appLoaded && to.name !== "SignIn") {
		store.watch(
			(state) => state.appLoaded,
			() => next()
		);

		return;
	}

	next();
});

router.beforeEach((to, from, next) => {
	// Disallow navigating to non-existing routes
	if (!to.matched.length) {
		next(false);
		return;
	}

	// Disallow navigating to invalid channels
	if (to.name === "RoutedChat" && !store.getters.findChannel(Number(to.params.id))) {
		next(false);
		return;
	}

	// Disallow navigating to invalid networks
	if (to.name === "NetworkEdit" && !store.getters.findNetwork(to.params.uuid)) {
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

router.afterEach((to) => {
	if (store.state.appLoaded) {
		if (window.innerWidth <= constants.mobileViewportPixels) {
			store.commit("sidebarOpen", false);
		}
	}

	if (store.state.activeChannel) {
		const channel = store.state.activeChannel.channel;

		if (to.name !== "RoutedChat") {
			store.commit("activeChannel", null);
		}

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

function navigate(routeName, params = {}) {
	if (router.currentRoute.name) {
		router.push({name: routeName, params}).catch(() => {});
	} else {
		// If current route is null, replace the history entry
		// This prevents invalid entries from lingering in history,
		// and then the route guard preventing proper navigation
		router.replace({name: routeName, params}).catch(() => {});
	}
}

function switchToChannel(channel) {
	return navigate("RoutedChat", {id: channel.id});
}

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data && event.data.type === "open") {
			const id = parseInt(event.data.channel.substr(5), 10); // remove "chan-" prefix

			const channelTarget = store.getters.findChannel(id);

			if (channelTarget) {
				switchToChannel(channelTarget.channel);
			}
		}
	});
}

export {router, navigate, switchToChannel};
