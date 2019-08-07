"use strict";

const $ = require("jquery");
const socket = require("../socket");
const {vueApp, findChannel} = require("../vue");

socket.on("msg:special", function(data) {
	findChannel(data.chan).channel.data = data.data;

	vueApp.$nextTick(() => {
		$(`#sidebar .chan[data-id="${data.chan}"]`).trigger("click");
	});
});
