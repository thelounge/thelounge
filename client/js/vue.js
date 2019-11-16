"use strict";

import Vue from "vue";
import store from "./store";
import App from "../components/App.vue";
import localetime from "./helpers/localetime";
import storage from "./localStorage";
import {router, navigate} from "./router";
import constants from "./constants";
import socket from "./socket";

Vue.filter("localetime", localetime);

import "./socket-events";
import "./webpush";
import "./keybinds";

const favicon = document.getElementById("favicon");
const faviconNormal = favicon.getAttribute("href");
const faviconAlerted = favicon.dataset.other;

const vueApp = new Vue({
	el: "#viewport",
	router,
	mounted() {
		socket.open();
	},
	methods: {
		switchToChannel(channel) {
			navigate("RoutedChat", {id: channel.id});
		},
	},
	render(createElement) {
		return createElement(App, {
			ref: "app",
			props: this,
		});
	},
	store,
});

store.watch(
	(state) => state.sidebarOpen,
	(sidebarOpen) => {
		if (window.outerWidth > constants.mobileViewportPixels) {
			storage.set("thelounge.state.sidebar", sidebarOpen);
		}

		vueApp.$emit("resize");
	}
);

store.watch(
	(state) => state.userlistOpen,
	(userlistOpen) => {
		storage.set("thelounge.state.userlist", userlistOpen);
		vueApp.$emit("resize");
	}
);

store.watch(
	(_, getters) => getters.title,
	(title) => {
		document.title = title;
	}
);

// Toggles the favicon to red when there are unread notifications
store.watch(
	(_, getters) => getters.highlightCount,
	(highlightCount) => {
		favicon.setAttribute("href", highlightCount > 0 ? faviconAlerted : faviconNormal);
	}
);

Vue.config.errorHandler = function(e) {
	store.commit("currentUserVisibleError", `Vue error: ${e.message}`);
	console.error(e); // eslint-disable-line
};
