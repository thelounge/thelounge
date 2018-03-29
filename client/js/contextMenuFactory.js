"use strict";
const $ = require("jquery");
const socket = require("./socket");
const utils = require("./utils");
const JoinChannel = require("./join-channel");
const ContextMenu = require("./contextMenu");
const contextMenuActions = [];
const contextMenuItems = [];

module.exports = {
	addContextMenuItem,
	createContextMenu,
};

addDefaultItems();

/**
 * Used for adding context menu items. eg:
 *
 * addContextMenuItem({
 * 		check: (target) => target.hasClass("user"),
 * 		className: "customItemName",
 * 	 	data: (target) => target.data("name"),
 * 	 	displayName: "Do something",
 * 	 	callback: (name) => console.log(name), // print the name of the user to console
 * });
 *
 * @param opts
 * @param {function(Object)} [opts.check] - Function to check whether item should show on the context menu, called with the target jquery element, shows if return is truthy
 * @param {string|function(Object)} opts.className - class name for the menu item, should be prefixed for non-default menu items (if function, called with jquery element, and uses return value)
 * @param {string|function(Object)} opts.data - data that will be sent to the callback function (if function, called with jquery element, and uses return value)
 * @param {string|function(Object)} opts.displayName - text to display on the menu item (if function, called with jquery element, and uses return value)
 * @param {function(Object)} opts.callback - Function to call when the context menu item is clicked, called with the data requested in opts.data
 */
function addContextMenuItem(opts) {
	opts.check = opts.check || (() => true);
	opts.actionId = contextMenuActions.push(opts.callback) - 1;
	contextMenuItems.push(opts);
}

function addContextDivider(opts) {
	opts.check = opts.check || (() => true);
	opts.divider = true;
	contextMenuItems.push(opts);
}

function createContextMenu(that, event) {
	return new ContextMenu(contextMenuItems, contextMenuActions, that, event);
}

function addWhoisItem() {
	function whois(itemData) {
		const chan = utils.findCurrentNetworkChan(itemData);

		if (chan.length) {
			chan.click();
		}

		socket.emit("input", {
			target: $("#chat").data("id"),
			text: "/whois " + itemData,
		});

		$(`.channel.active .userlist .user[data-name="${itemData}"]`).trigger("click");
	}

	addContextMenuItem({
		check: (target) => target.hasClass("user"),
		className: "user",
		displayName: (target) => target.data("name"),
		data: (target) => target.data("name"),
		callback: whois,
	});

	addContextDivider({
		check: (target) => target.hasClass("user"),
	});

	addContextMenuItem({
		check: (target) => target.hasClass("user"),
		className: "action-whois",
		displayName: "User information",
		data: (target) => target.data("name"),
		callback: whois,
	});
}

function addQueryItem() {
	function query(itemData) {
		const chan = utils.findCurrentNetworkChan(itemData);

		if (chan.length) {
			chan.click();
		}

		socket.emit("input", {
			target: $("#chat").data("id"),
			text: "/query " + itemData,
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("user"),
		className: "action-query",
		displayName: "Direct messages",
		data: (target) => target.data("name"),
		callback: query,
	});
}

function addKickItem() {
	function kick(itemData) {
		socket.emit("input", {
			target: $("#chat").data("id"),
			text: "/kick " + itemData,
		});
	}

	addContextMenuItem({
		check: (target) => utils.hasRoleInChannel(target.closest(".chan"), ["op"]) && target.closest(".chan").data("type") === "channel",
		className: "action-kick",
		displayName: "Kick",
		data: (target) => target.data("name"),
		callback: kick,
	});
}

function addFocusItem() {
	function focusChan(itemData) {
		$(`.networks .chan[data-target="${itemData}"]`).click();
	}

	const getClass = (target) => {
		if (target.hasClass("lobby")) {
			return "network";
		} else if (target.hasClass("query")) {
			return "query";
		}

		return "chan";
	};

	addContextMenuItem({
		check: (target) => target.hasClass("chan"),
		className: getClass,
		displayName: (target) => target.attr("aria-label"),
		data: (target) => target.data("target"),
		callback: focusChan,
	});

	addContextDivider({
		check: (target) => target.hasClass("chan"),
	});
}

function addChannelListItem() {
	function list(itemData) {
		socket.emit("input", {
			target: itemData,
			text: "/list",
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("lobby"),
		className: "list",
		displayName: "List all channels",
		data: (target) => target.data("id"),
		callback: list,
	});
}

function addBanListItem() {
	function banlist(itemData) {
		socket.emit("input", {
			target: itemData,
			text: "/banlist",
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("channel"),
		className: "list",
		displayName: "List banned users",
		data: (target) => target.data("id"),
		callback: banlist,
	});
}

function addJoinItem() {
	function openJoinForm(itemData) {
		const network = $(`#join-channel-${itemData}`).closest(".network");
		JoinChannel.openForm(network);
	}

	addContextMenuItem({
		check: (target) => target.hasClass("lobby"),
		className: "join",
		displayName: "Join a channel…",
		data: (target) => target.data("id"),
		callback: openJoinForm,
	});
}

function addDefaultItems() {
	addWhoisItem();
	addQueryItem();
	addKickItem();
	addFocusItem();
	addChannelListItem();
	addBanListItem();
	addJoinItem();
}
