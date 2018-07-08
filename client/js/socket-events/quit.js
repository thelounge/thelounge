"use strict";

const $ = require("jquery");
const socket = require("../socket");
const sidebar = $("#sidebar");
const {Vue, vueApp} = require("../vue");

socket.on("quit", function(data) {
	vueApp.networks.splice(vueApp.networks.findIndex((n) => n.uuid === data.network), 1);

	Vue.nextTick(() => {
		const chan = sidebar.find(".chan");

		if (chan.length === 0) {
			// Open the connect window
			$("#footer .connect").trigger("click", {
				pushState: false,
			});
		} else {
			chan.eq(0).trigger("click");
		}
	});
});
