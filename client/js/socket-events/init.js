"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const webpush = require("../webpush");
const sidebar = $("#sidebar");
const storage = require("../localStorage");
const utils = require("../utils");

socket.on("init", function(data) {
	$("#loading-page-message, #connection-error").text("Rendering…");

	const lastMessageId = utils.lastMessageId;

	// TODO: this is hacky
	if (lastMessageId > -1) {
		sidebar.find(".networks").empty();
		$("#chat").empty();
	}

	if (data.networks.length === 0) {
		sidebar.find(".empty").show();

		$("#footer").find(".connect").trigger("click", {
			pushState: false,
		});
	} else {
		render.renderNetworks(data);
	}

	if (lastMessageId > -1) {
		$("#connection-error").removeClass("shown");
		$(".show-more-button, #input").prop("disabled", false);
		$("#submit").show();
	} else {
		if (data.token) {
			storage.set("token", data.token);
		}

		webpush.configurePushNotifications(data.pushSubscription, data.applicationServerKey);

		$("body").removeClass("signed-out");
		$("#loading").remove();
		$("#sign-in").remove();
	}

	const id = data.active;
	const target = sidebar.find("[data-id='" + id + "']").trigger("click", {
		replaceHistory: true
	});
	const dataTarget = document.querySelector("[data-target='" + window.location.hash + "']");
	if (window.location.hash && dataTarget) {
		dataTarget.click();
	} else if (target.length === 0) {
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
