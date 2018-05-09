"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const templates = require("../../views");
const sidebar = $("#sidebar");
const utils = require("../utils");

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
	sidebar.find(`.network[data-uuid="${data.network}"]`).data("options", data.serverOptions);
});

socket.on("network:status", function(data) {
	sidebar
		.find(`.network[data-uuid="${data.network}"]`)
		.toggleClass("not-connected", !data.connected)
		.toggleClass("not-secure", !data.secure);
});

socket.on("network:info", function(data) {
	$("#connect")
		.html(templates.windows.connect(data))
		.find("form").on("submit", function() {
			const uuid = $(this).find("input[name=uuid]").val();
			const newName = $(this).find("#connect\\:name").val();

			sidebar.find(`.network[data-uuid="${uuid}"] .chan.lobby .name`)
				.attr("title", newName)
				.text(newName)
				.click();
		});

	utils.togglePasswordField(".reveal-password");
});
