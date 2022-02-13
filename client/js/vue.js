"use strict";

const constants = require("./constants");

import "../css/style.css";
import {createApp} from "vue";
import store from "./store";
import App from "../components/App.vue";
import storage from "./localStorage";
import {router, navigate} from "./router";
import socket from "./socket";
import eventbus from "./eventbus";

import "./socket-events";
import "./webpush";
import "./keybinds";

const favicon = document.getElementById("favicon");
const faviconNormal = favicon.getAttribute("href");
const faviconAlerted = favicon.dataset.other;

const app = createApp(App);
router.app = app;
app.use(router);
app.use(store);
app.mixin({
	methods: {
		switchToChannel(channel) {
			navigate("RoutedChat", {id: channel.id});
		},
		closeChannel(channel) {
			if (channel.type === "lobby") {
				eventbus.emit(
					"confirm-dialog",
					{
						title: "Remove network",
						text: `Are you sure you want to quit and remove ${channel.name}? This cannot be undone.`,
						button: "Remove network",
					},
					(result) => {
						if (!result) {
							return;
						}

						channel.closed = true;
						socket.emit("input", {
							target: Number(channel.id),
							text: "/quit",
						});
					}
				);

				return;
			}

			channel.closed = true;

			socket.emit("input", {
				target: Number(channel.id),
				text: "/close",
			});
		},
	},
});
app.mount("body");

socket.open();

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

app.config.errorHandler = function (e) {
	store.commit("currentUserVisibleError", `Vue error: ${e.message}`);
	console.error(e); // eslint-disable-line
};
