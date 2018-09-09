"use strict";

const $ = require("jquery");
const escape = require("css.escape");
const socket = require("../socket");
const webpush = require("../webpush");
const slideoutMenu = require("../slideout");
const sidebar = $("#sidebar");
const storage = require("../localStorage");
const utils = require("../utils");
const {vueApp, initChannel} = require("../vue");

socket.on("init", function(data) {
	vueApp.currentUserVisibleError = "Rendering…";
	$("#loading-page-message").text(vueApp.currentUserVisibleError);

	const previousActive = vueApp.activeChannel && vueApp.activeChannel.channel.id;

	const networks = new Set(JSON.parse(storage.get("thelounge.networks.collapsed")));

	for (const network of data.networks) {
		network.isCollapsed = networks.has(network.uuid);
		network.channels.forEach(initChannel);

		const currentNetwork = vueApp.networks.find((n) => n.uuid === network.uuid);

		// If we are reconnecting, merge existing state variables because they don't exist on the server
		if (!currentNetwork) {
			network.isJoinChannelShown = false;

			continue;
		}

		network.isJoinChannelShown = currentNetwork.isJoinChannelShown;

		for (const channel of network.channels) {
			const currentChannel = currentNetwork.channels.find((c) => c.id === channel.id);

			if (!currentChannel) {
				continue;
			}

			channel.scrolledToBottom = currentChannel.scrolledToBottom;
			channel.pendingMessage = currentChannel.pendingMessage;

			// Reconnection only sends new messages, so merge it on the client
			if (currentChannel.messages) {
				channel.messages = currentChannel.messages.concat(channel.messages);
			}

			if (currentChannel.moreHistoryAvailable) {
				channel.moreHistoryAvailable = true;
			}
		}
	}

	vueApp.networks = data.networks;
	vueApp.isConnected = true;
	vueApp.currentUserVisibleError = null;

	if (!vueApp.initialized) {
		vueApp.initialized = true;

		if (data.token) {
			storage.set("token", data.token);
		}

		webpush.configurePushNotifications(data.pushSubscription, data.applicationServerKey);

		slideoutMenu.enable();

		const viewport = $("#viewport");
		const viewportWidth = $(window).outerWidth();
		let isUserlistOpen = storage.get("thelounge.state.userlist");

		if (viewportWidth > utils.mobileViewportPixels) {
			slideoutMenu.toggle(storage.get("thelounge.state.sidebar") !== "false");
		}

		// If The Lounge is opened on a small screen (less than 1024px), and we don't have stored
		// user list state, close it by default
		if (viewportWidth >= 1024 && isUserlistOpen !== "true" && isUserlistOpen !== "false") {
			isUserlistOpen = "true";
		}

		viewport.toggleClass("userlist-open", isUserlistOpen === "true");

		$(document.body).removeClass("signed-out");
		$("#loading").remove();
		$("#sign-in").remove();

		if (window.g_LoungeErrorHandler) {
			window.removeEventListener("error", window.g_LoungeErrorHandler);
			window.g_LoungeErrorHandler = null;
		}
	}

	vueApp.$nextTick(() => openCorrectChannel(previousActive, data.active));

	utils.confirmExit();
	utils.synchronizeNotifiedState();
});

function openCorrectChannel(clientActive, serverActive) {
	let target = $();

	// Open last active channel
	if (clientActive > 0) {
		target = sidebar.find(`.chan[data-id="${clientActive}"]`);
	}

	// Open window provided in location.hash
	if (target.length === 0 && window.location.hash) {
		target = $(`[data-target="${escape(window.location.hash)}"]`).first();
	}

	// Open last active channel according to the server
	if (serverActive > 0 && target.length === 0) {
		target = sidebar.find(`.chan[data-id="${serverActive}"]`);
	}

	// Open first available channel
	if (target.length === 0) {
		target = sidebar.find(".chan").first();
	}

	// If target channel is found, open it
	if (target.length > 0) {
		target.trigger("click", {
			replaceHistory: true,
		});

		return;
	}

	// Open the connect window
	$("#footer .connect").trigger("click", {
		pushState: false,
	});
}
