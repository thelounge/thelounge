import constants from "./constants";

import "../css/style.css";
import {createApp} from "vue";
import {store, CallableGetters, key} from "./store";
import App from "../components/App.vue";
import storage from "./localStorage";
import {router} from "./router";
import socket from "./socket";
import eventbus from "./eventbus";

import "./socket-events";
import "./webpush";
import "./keybinds";
import {LoungeWindow} from "./types";

const favicon = document.getElementById("favicon");
const faviconNormal = favicon?.getAttribute("href") || "";
const faviconAlerted = favicon?.dataset.other || "";

export const VueApp = createApp(App);

VueApp.use(router);
VueApp.use(store, key);

VueApp.mount("#app");
socket.open();

store.watch(
	(state) => state.sidebarOpen,
	(sidebarOpen) => {
		if (window.innerWidth > constants.mobileViewportPixels) {
			storage.set("thelounge.state.sidebar", sidebarOpen.toString());
			eventbus.emit("resize");
		}
	}
);

store.watch(
	(state) => state.userlistOpen,
	(userlistOpen) => {
		storage.set("thelounge.state.userlist", userlistOpen.toString());
		eventbus.emit("resize");
	}
);

store.watch(
	(_, getters: CallableGetters) => getters.title,
	(title) => {
		document.title = title;
	}
);

// Toggles the favicon to red when there are unread notifications
store.watch(
	(_, getters: CallableGetters) => getters.highlightCount,
	(highlightCount) => {
		favicon?.setAttribute("href", highlightCount > 0 ? faviconAlerted : faviconNormal);

		const nav: LoungeWindow["navigator"] = window.navigator;

		if (nav.setAppBadge) {
			if (highlightCount > 0) {
				nav.setAppBadge(highlightCount);
			} else {
				if (nav.clearAppBadge) {
					nav.clearAppBadge();
				}
			}
		}
	}
);

VueApp.config.errorHandler = function (e) {
	if (e instanceof Error) {
		store.commit("currentUserVisibleError", `Vue error: ${e.message}`);
	} else {
		store.commit("currentUserVisibleError", `Vue error: ${String(e)}`);
	}

	// eslint-disable-next-line no-console
	console.error(e);
};
