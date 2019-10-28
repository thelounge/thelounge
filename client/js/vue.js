"use strict";

const Vue = require("vue").default;

const store = require("./store").default;
const App = require("../components/App.vue").default;
const roundBadgeNumber = require("./libs/handlebars/roundBadgeNumber");
const localetime = require("./libs/handlebars/localetime");
const friendlysize = require("./libs/handlebars/friendlysize");
const colorClass = require("./libs/handlebars/colorClass");
const storage = require("./localStorage");
const router = require("./router").default;
const constants = require("./constants");

Vue.filter("localetime", localetime);
Vue.filter("friendlysize", friendlysize);
Vue.filter("colorClass", colorClass);
Vue.filter("roundBadgeNumber", roundBadgeNumber);

const vueApp = new Vue({
	el: "#viewport",
	data: {
		activeChannel: null,
		appName: document.title,
		currentUserVisibleError: null,
		initialized: false,
		isAutoCompleting: false,
		isFileUploadEnabled: false,
		networks: [],
		pushNotificationState: "unsupported",
		desktopNotificationState: "unsupported",
		serverConfiguration: {},
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
		Vue.nextTick(() => window.vueMounted());

		if (navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)) {
			document.body.classList.add("is-apple");
		}

		document.addEventListener("visibilitychange", this.synchronizeNotifiedState());
		document.addEventListener("focus", this.synchronizeNotifiedState());
		document.addEventListener("click", this.synchronizeNotifiedState());
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
		findChannel(id) {
			for (const network of this.networks) {
				for (const channel of network.channels) {
					if (channel.id === id) {
						return {network, channel};
					}
				}
			}

			return null;
		},
		findNetwork(uuid) {
			for (const network of this.networks) {
				if (network.uuid === uuid) {
					return network;
				}
			}

			return null;
		},
		switchToChannel(channel) {
			if (this.activeChannel && this.activeChannel.channel.id === channel.id) {
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

			for (const network of this.networks) {
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
			let title = this.appName;

			if (this.activeChannel) {
				title = `${this.activeChannel.channel.name} — ${title}`;
			}

			// add highlight count to title
			let alertEventCount = 0;

			for (const network of this.networks) {
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
	console.error(e); // eslint-disable-line
	vueApp.currentUserVisibleError = `Vue error: ${e.message}. Please check devtools and report it in #thelounge`;
};

function findChannel(id) {
	return vueApp.findChannel(id);
}

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
	findChannel,
	initChannel,
	getActiveWindowComponent,
};
