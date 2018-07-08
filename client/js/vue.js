"use strict";

const Vue = require("vue").default;
const App = require("../components/App.vue").default;
const roundBadgeNumber = require("./libs/handlebars/roundBadgeNumber");
const parse = require("./libs/handlebars/parse");
const tz = require("./libs/handlebars/tz");
const localetime = require("./libs/handlebars/localetime");
const localedate = require("./libs/handlebars/localedate");
const friendlydate = require("./libs/handlebars/friendlydate");
const colorClass = require("./libs/handlebars/colorClass");

Vue.filter("parse", parse);
Vue.filter("tz", tz);
Vue.filter("localetime", localetime);
Vue.filter("localedate", localedate);
Vue.filter("friendlydate", friendlydate);
Vue.filter("colorClass", colorClass);
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
