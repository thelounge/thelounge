"use strict";

const Vue = require("vue").default;
const App = require("../components/App.vue").default;
const roundBadgeNumber = require("./libs/handlebars/roundBadgeNumber");

Vue.filter("roundBadgeNumber", roundBadgeNumber);

const vueApp = new Vue({
	el: "#viewport",
	data: {
		appName: document.title,
		activeChannel: null,
		networks: [],
	},
	render(createElement) {
		return createElement(App, {
			props: this,
		});
	},
});

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

module.exports = {
	Vue,
	vueApp,
	findChannel,
};
