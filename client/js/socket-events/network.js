"use strict";

const $ = require("jquery");
const socket = require("../socket");
const templates = require("../../views");
const sidebar = $("#sidebar");
const utils = require("../utils");
const {vueApp} = require("../vue");

socket.on("network", function(data) {
	const network = data.networks[0];

	for (const channel of network.channels) {
		if (channel.type === "channel") {
			channel.usersOutdated = true;
		}
	}

	vueApp.networks.push(network);

	vueApp.$nextTick(() => {
		sidebar.find(".chan")
			.last()
			.trigger("click");
	});

	$("#connect")
		.find(".btn")
		.prop("disabled", false);
});

socket.on("network_changed", function(data) {
	vueApp.networks.find((n) => n.uuid === data.network).serverOptions = data.serverOptions;
});

socket.on("network:status", function(data) {
	const network = vueApp.networks.find((n) => n.uuid === data.network);
	network.status.connected = data.connected;
	network.status.secure = data.secure;
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

	utils.togglePasswordField("#connect .reveal-password");
});
