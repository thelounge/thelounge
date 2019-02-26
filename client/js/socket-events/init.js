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

	vueApp.networks = mergeNetworkData(data.networks);
	vueApp.$store.commit("isConnected", true);
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

function mergeNetworkData(newNetworks) {
	const collapsedNetworks = new Set(JSON.parse(storage.get("thelounge.networks.collapsed")));

	for (let n = 0; n < newNetworks.length; n++) {
		const network = newNetworks[n];
		const currentNetwork = vueApp.networks.find((net) => net.uuid === network.uuid);

		// If this network is new, set some default variables and initalize channel variables
		if (!currentNetwork) {
			network.isJoinChannelShown = false;
			network.isCollapsed = collapsedNetworks.has(network.uuid);
			network.channels.forEach(initChannel);

			continue;
		}

		// Merge received network object into existing network object on the client
		// so the object reference stays the same (e.g. for vueApp.currentChannel)
		for (const key in network) {
			if (!Object.prototype.hasOwnProperty.call(network, key)) {
				continue;
			}

			// Channels require extra care to be merged correctly
			if (key === "channels") {
				currentNetwork.channels = mergeChannelData(
					currentNetwork.channels,
					network.channels
				);
			} else {
				currentNetwork[key] = network[key];
			}
		}

		newNetworks[n] = currentNetwork;
	}

	return newNetworks;
}

function mergeChannelData(oldChannels, newChannels) {
	for (let c = 0; c < newChannels.length; c++) {
		const channel = newChannels[c];
		const currentChannel = oldChannels.find((chan) => chan.id === channel.id);

		// This is a new channel that was joined while client was disconnected, initialize it
		if (!currentChannel) {
			initChannel(channel);

			continue;
		}

		// Merge received channel object into existing currentChannel
		// so the object references are exactly the same (e.g. in vueApp.activeChannel)
		for (const key in channel) {
			if (!Object.prototype.hasOwnProperty.call(channel, key)) {
				continue;
			}

			// Server sends an empty users array, client requests it whenever needed
			if (key === "users") {
				if (channel.type === "channel") {
					if (vueApp.activeChannel && vueApp.activeChannel.channel === currentChannel) {
						// For currently open channel, request the user list straight away
						socket.emit("names", {
							target: channel.id,
						});
					} else {
						// For all other channels, mark the user list as outdated
						// so an update will be requested whenever user switches to these channels
						currentChannel.usersOutdated = true;
					}
				}

				continue;
			}

			// Server sends total count of messages in memory, we compare it to amount of messages
			// on the client, and decide whether theres more messages to load from server
			if (key === "totalMessages") {
				currentChannel.moreHistoryAvailable =
					channel.totalMessages > currentChannel.messages.length;

				continue;
			}

			// Reconnection only sends new messages, so merge it on the client
			// Only concat if server sent us less than 100 messages so we don't introduce gaps
			if (key === "messages" && currentChannel.messages && channel.messages.length < 100) {
				currentChannel.messages = currentChannel.messages.concat(channel.messages);
			} else {
				currentChannel[key] = channel[key];
			}
		}

		newChannels[c] = currentChannel;
	}

	return newChannels;
}
