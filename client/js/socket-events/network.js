"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const sidebar = $("#sidebar");

socket.on("network", function(data) {
	render.renderNetworks(data, true);

	sidebar.find(".chan")
		.last()
		.trigger("click");

	$("#connect")
		.find(".btn")
		.prop("disabled", false);
});

socket.on("network_changed", function(data) {
	sidebar.find("#network-" + data.network).data("options", data.serverOptions);
});
