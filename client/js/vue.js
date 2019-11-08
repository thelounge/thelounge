"use strict";

const Vue = require("vue").default;

const store = require("./store").default;
const App = require("../components/App.vue").default;
const localetime = require("./helpers/localetime");
const storage = require("./localStorage");
const {router} = require("./router");
const constants = require("./constants");

Vue.filter("localetime", localetime);

const favicon = document.getElementById("favicon");
const faviconNormal = favicon.getAttribute("href");
const faviconAlerted = favicon.dataset.other;

const vueApp = new Vue({
	el: "#viewport",
	router,
	mounted() {
		// TODO: Hackfix because socket-events require vueApp somewhere
		// and that breaks due to cyclical depenency as by this point vue.js
		// does not export anything yet.
		setTimeout(() => {
			const socket = require("./socket");

			require("./socket-events");
			require("./contextMenuFactory");
			require("./webpush");
			require("./keybinds");

			socket.open();
		}, 1);
	},
	methods: {
		switchToChannel(channel) {
			if (
				this.$store.state.activeChannel &&
				this.$store.state.activeChannel.channel.id === channel.id
			) {
				return;
			}

			this.$router.push("/chan-" + channel.id);
		},
		switchOutOfChannel(channel) {
			// When switching out of a channel, mark everything as read
			if (channel.messages.length > 0) {
				channel.firstUnread = channel.messages[channel.messages.length - 1].id;
			}

			if (channel.messages.length > 100) {
				channel.messages.splice(0, channel.messages.length - 100);
				channel.moreHistoryAvailable = true;
			}
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

function initChannel(channel) {
	channel.pendingMessage = "";
	channel.inputHistoryPosition = 0;
	channel.inputHistory = [""];
	channel.historyLoading = false;
	channel.scrolledToBottom = true;
	channel.editTopic = false;

	channel.moreHistoryAvailable = channel.totalMessages > channel.messages.length;
	delete channel.totalMessages;

	if (channel.type === "channel") {
		channel.usersOutdated = true;
	}
}

function getActiveWindowComponent() {
	return vueApp.$refs.app.$refs.window;
}

module.exports = {
	vueApp,
	initChannel,
	getActiveWindowComponent,
};
