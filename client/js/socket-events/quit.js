"use strict";

const $ = require("jquery");
const socket = require("../socket");
const sidebar = $("#sidebar");
const {vueApp} = require("../vue");
const store = require("../store").default;

socket.on("quit", function(data) {
	store.commit("removeNetwork", data.network);

	vueApp.$nextTick(() => {
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
