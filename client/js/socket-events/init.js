"use strict";
const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const sidebar = $("#sidebar, #footer");
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

	if (data.token && $("#sign-in-remember").is(":checked")) {
		storage.set("token", data.token);
	} else {
		window.localStorage.removeItem("token");
	}

	$("body").removeClass("signed-out");
	$("#loading").remove();
	$("#sign-in").remove();

	var id = data.active;
	var target = sidebar.find("[data-id='" + id + "']").trigger("click");
	if (target.length === 0) {
		var first = sidebar.find(".chan")
			.eq(0)
			.trigger("click");
		if (first.length === 0) {
			$("#footer").find(".connect").trigger("click", {
				pushState: false,
			});
		}
	}
});
