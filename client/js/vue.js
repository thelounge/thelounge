"use strict";

const constants = require("./constants");

import "../css/style.css";
import {createApp} from "vue";
import store from "./store";
import App from "../components/App.vue";
import storage from "./localStorage";
import {router} from "./router";
import eventbus from "./eventbus";

import "./socket-events";
import "./webpush";
import "./keybinds";

const favicon = document.getElementById("favicon");
const faviconNormal = favicon.getAttribute("href");
const faviconAlerted = favicon.dataset.other;

const vueApp = createApp(App);
vueApp.use(store);
vueApp.use(router);
vueApp.mount("#viewport-mount");

store.watch(
	(state) => state.sidebarOpen,
	(sidebarOpen) => {
		if (window.innerWidth > constants.mobileViewportPixels) {
			storage.set("thelounge.state.sidebar", sidebarOpen);
			eventbus.emit("resize");
		}
	}
);

store.watch(
	(state) => state.userlistOpen,
	(userlistOpen) => {
		storage.set("thelounge.state.userlist", userlistOpen);
		eventbus.emit("resize");
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

		if (navigator.setAppBadge) {
			if (highlightCount > 0) {
				navigator.setAppBadge(highlightCount);
			} else {
				navigator.clearAppBadge();
			}
		}
	}
);

vueApp.config.errorHandler = function (e) {
	store.commit("currentUserVisibleError", `Vue error: ${e.message}`);
	console.error(e); // eslint-disable-line
};
