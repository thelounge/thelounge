"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const sidebar = $("#sidebar");
const storage = require("../localStorage");

socket.on("init", function(data) {
	$("#loading-page-message").text("Rendering…");

	if (data.networks.length === 0) {
		$("#footer").find(".connect").trigger("click", {
			pushState: false,
		});
	} else {
		render.renderNetworks(data);
	}

	if (data.token) {
		storage.set("token", data.token);
	}

	$("body").removeClass("signed-out");
	$("#loading").remove();
	$("#sign-in").remove();

	const id = data.active;
	const target = sidebar.find("[data-id='" + id + "']").trigger("click", {
		replaceHistory: true
	});
	if (target.length === 0) {
		const first = sidebar.find(".chan")
			.eq(0)
			.trigger("click");
		if (first.length === 0) {
			$("#footer").find(".connect").trigger("click", {
				pushState: false,
			});
		}
	}
});
