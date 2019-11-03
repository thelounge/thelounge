"use strict";

const Vue = require("vue").default;

const store = require("./store").default;
const App = require("../components/App.vue").default;
const roundBadgeNumber = require("./libs/handlebars/roundBadgeNumber");
const localetime = require("./libs/handlebars/localetime");
const friendlysize = require("./libs/handlebars/friendlysize");
const colorClass = require("./libs/handlebars/colorClass");
const storage = require("./localStorage");
const {router} = require("./router");
const constants = require("./constants");

Vue.filter("localetime", localetime);
Vue.filter("friendlysize", friendlysize);
Vue.filter("colorClass", colorClass);
Vue.filter("roundBadgeNumber", roundBadgeNumber);

const appName = document.title;

const vueApp = new Vue({
	el: "#viewport",
	data: {
		initialized: false,
		settings: {
			syncSettings: false,
			advanced: false,
			autocomplete: true,
			nickPostfix: "",
			coloredNicks: true,
			desktopNotifications: false,
			highlights: "",
			links: true,
			motd: true,
			notification: true,
			notifyAllMessages: false,
			showSeconds: false,
			statusMessages: "condensed",
			theme: document.getElementById("theme").dataset.serverTheme,
			media: true,
			userStyles: "",
		},
	},
	router,
	mounted() {
		if (navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)) {
			document.body.classList.add("is-apple");
		}

		document.addEventListener("visibilitychange", this.synchronizeNotifiedState);
		document.addEventListener("focus", this.synchronizeNotifiedState);
		document.addEventListener("click", this.synchronizeNotifiedState);

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
		onSocketInit() {
			this.initialized = true;
			this.$store.commit("isConnected", true);
		},
		setSidebar(state) {
			this.$store.commit("sidebarOpen", state);

			if (window.outerWidth > constants.mobileViewportPixels) {
				storage.set("thelounge.state.sidebar", state);
			}

			this.$emit("resize");
		},
		toggleSidebar() {
			this.setSidebar(!this.$store.state.sidebarOpen);
		},
		closeSidebarIfNeeded() {
			if (window.innerWidth <= constants.mobileViewportPixels) {
				this.setSidebar(false);
			}
		},
		setUserlist(state) {
			storage.set("thelounge.state.userlist", state);
			this.$store.commit("userlistOpen", state);
			this.$emit("resize");
		},
		toggleUserlist() {
			this.setUserlist(!this.$store.state.userlistOpen);
		},
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
		synchronizeNotifiedState() {
			this.updateTitle();

			let hasAnyHighlights = false;

			for (const network of this.$store.state.networks) {
				for (const chan of network.channels) {
					if (chan.highlight > 0) {
						hasAnyHighlights = true;
						break;
					}
				}
			}

			this.toggleNotificationMarkers(hasAnyHighlights);
		},
		updateTitle() {
			let title = appName;

			if (this.$store.state.activeChannel) {
				title = `${this.$store.state.activeChannel.channel.name} — ${title}`;
			}

			// add highlight count to title
			let alertEventCount = 0;

			for (const network of this.$store.state.networks) {
				for (const channel of network.channels) {
					alertEventCount += channel.highlight;
				}
			}

			if (alertEventCount > 0) {
				title = `(${alertEventCount}) ${title}`;
			}

			document.title = title;
		},
		toggleNotificationMarkers(newState) {
			if (this.$store.state.isNotified !== newState) {
				// Toggles a dot on the menu icon when there are unread notifications
				this.$store.commit("isNotified", newState);

				// Toggles the favicon to red when there are unread notifications
				const favicon = document.getElementById("favicon");
				const old = favicon.getAttribute("href");
				favicon.setAttribute("href", favicon.dataset.other);
				favicon.dataset.other = old;
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
