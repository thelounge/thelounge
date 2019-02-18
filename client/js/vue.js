"use strict";

const Vue = require("vue").default;
const App = require("../components/App.vue").default;
const roundBadgeNumber = require("./libs/handlebars/roundBadgeNumber");
const localetime = require("./libs/handlebars/localetime");
const friendlysize = require("./libs/handlebars/friendlysize");
const colorClass = require("./libs/handlebars/colorClass");

Vue.filter("localetime", localetime);
Vue.filter("friendlysize", friendlysize);
Vue.filter("colorClass", colorClass);
Vue.filter("roundBadgeNumber", roundBadgeNumber);

const vueApp = new Vue({
	el: "#viewport",
	data: {
		activeWindow: null,
		activeChannel: null,
		appName: document.title,
		currentUserVisibleError: null,
		initialized: false,
		isAutoCompleting: false,
		isConnected: false,
		isFileUploadEnabled: false,
		isNotified: false,
		networks: [],
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
	mounted() {
		Vue.nextTick(() => window.vueMounted());
	},
	render(createElement) {
		return createElement(App, {
			ref: "app",
			props: this,
		});
	},
});

Vue.config.errorHandler = function(e) {
	console.error(e); // eslint-disable-line
	vueApp.currentUserVisibleError = `Vue error: ${e.message}. Please check devtools and report it in #thelounge`;
};

function findChannel(id) {
	for (const network of vueApp.networks) {
		for (const channel of network.channels) {
			if (channel.id === id) {
				return {network, channel};
			}
		}
	}

	return null;
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
