"use strict";

const $ = require("jquery");
const socket = require("./socket");
const utils = require("./utils");
const ContextMenu = require("./contextMenu");
const contextMenuActions = [];
const contextMenuItems = [];
const {findChannel} = require("./vue");

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
 * 	 	data: (target) => target.attr("data-name"),
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

		if (chan) {
			$(`#sidebar .chan[data-id="${chan.id}"]`).trigger("click");
		}

		socket.emit("input", {
			target: Number($("#chat").attr("data-id")),
			text: "/whois " + itemData,
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("user"),
		className: "user",
		displayName: (target) => target.attr("data-name"),
		data: (target) => target.attr("data-name"),
		callback: whois,
	});

	addContextDivider({
		check: (target) => target.hasClass("user"),
	});

	addContextMenuItem({
		check: (target) => target.hasClass("user") || target.hasClass("query"),
		className: "action-whois",
		displayName: "User information",
		data: (target) => target.attr("data-name") || target.attr("aria-label"),
		callback: whois,
	});
}

function addQueryItem() {
	function query(itemData) {
		const chan = utils.findCurrentNetworkChan(itemData);

		if (chan) {
			$(`#sidebar .chan[data-id="${chan.id}"]`).trigger("click");
		}

		socket.emit("input", {
			target: Number($("#chat").attr("data-id")),
			text: "/query " + itemData,
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("user"),
		className: "action-query",
		displayName: "Direct messages",
		data: (target) => target.attr("data-name"),
		callback: query,
	});
}

function addCloseItem() {
	function getCloseDisplay(target) {
		if (target.hasClass("lobby")) {
			return "Remove";
		} else if (target.hasClass("channel")) {
			return "Leave";
		}

		return "Close";
	}

	addContextMenuItem({
		check: (target) => target.hasClass("chan"),
		className: "close",
		displayName: getCloseDisplay,
		data: (target) => target.attr("data-target"),
		callback: (itemData) => utils.closeChan($(`.networks .chan[data-target="${itemData}"]`)),
	});
}

function addConnectItem() {
	function connect(itemData) {
		socket.emit("input", {
			target: Number(itemData),
			text: "/connect",
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("lobby") && target.parent().hasClass("not-connected"),
		className: "connect",
		displayName: "Connect",
		data: (target) => target.attr("data-id"),
		callback: connect,
	});
}

function addDisconnectItem() {
	function disconnect(itemData) {
		socket.emit("input", {
			target: Number(itemData),
			text: "/disconnect",
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("lobby") && !target.parent().hasClass("not-connected"),
		className: "disconnect",
		displayName: "Disconnect",
		data: (target) => target.attr("data-id"),
		callback: disconnect,
	});
}

function addKickItem() {
	function kick(itemData) {
		socket.emit("input", {
			target: Number($("#chat").attr("data-id")),
			text: "/kick " + itemData,
		});
	}

	addContextMenuItem({
		check: (target) => utils.hasRoleInChannel(target.closest(".chan"), ["op"]) && target.closest(".chan").attr("data-type") === "channel",
		className: "action-kick",
		displayName: "Kick",
		data: (target) => target.attr("data-name"),
		callback: kick,
	});
}

function addOpItem() {
	function op(itemData) {
		socket.emit("input", {
			target: Number($("#chat").attr("data-id")),
			text: "/op " + itemData,
		});
	}

	addContextMenuItem({
		check: (target) =>
			utils.hasRoleInChannel(target.closest(".chan"), ["op"]) &&
			!utils.hasRoleInChannel(target.closest(".chan"), ["op"], target.attr("data-name")),
		className: "action-op",
		displayName: "Give operator (+o)",
		data: (target) => target.attr("data-name"),
		callback: op,
	});
}

function addDeopItem() {
	function deop(itemData) {
		socket.emit("input", {
			target: Number($("#chat").attr("data-id")),
			text: "/deop " + itemData,
		});
	}

	addContextMenuItem({
		check: (target) =>
			utils.hasRoleInChannel(target.closest(".chan"), ["op"]) &&
			utils.hasRoleInChannel(target.closest(".chan"), ["op"], target.attr("data-name")),
		className: "action-op",
		displayName: "Revoke operator (-o)",
		data: (target) => target.attr("data-name"),
		callback: deop,
	});
}

function addVoiceItem() {
	function voice(itemData) {
		socket.emit("input", {
			target: Number($("#chat").attr("data-id")),
			text: "/voice " + itemData,
		});
	}

	addContextMenuItem({
		check: (target) =>
			utils.hasRoleInChannel(target.closest(".chan"), ["op"]) &&
			!utils.hasRoleInChannel(target.closest(".chan"), ["voice"], target.attr("data-name")),
		className: "action-voice",
		displayName: "Give voice (+v)",
		data: (target) => target.attr("data-name"),
		callback: voice,
	});
}

function addDevoiceItem() {
	function devoice(itemData) {
		socket.emit("input", {
			target: Number($("#chat").attr("data-id")),
			text: "/devoice " + itemData,
		});
	}

	addContextMenuItem({
		check: (target) =>
			utils.hasRoleInChannel(target.closest(".chan"), ["op"]) &&
			utils.hasRoleInChannel(target.closest(".chan"), ["voice"], target.attr("data-name")),
		className: "action-voice",
		displayName: "Revoke voice (-v)",
		data: (target) => target.attr("data-name"),
		callback: devoice,
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
		data: (target) => target.attr("data-target"),
		callback: focusChan,
	});

	addContextDivider({
		check: (target) => target.hasClass("chan"),
	});
}

function addEditNetworkItem() {
	function edit(itemData) {
		socket.emit("network:get", itemData);
		$('button[data-target="#connect"]').trigger("click");
	}

	addContextMenuItem({
		check: (target) => target.hasClass("lobby"),
		className: "edit",
		displayName: "Edit this network…",
		data: (target) => target.closest(".network").attr("data-uuid"),
		callback: edit,
	});
}

function addChannelListItem() {
	function list(itemData) {
		socket.emit("input", {
			target: parseInt(itemData, 10),
			text: "/list",
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("lobby"),
		className: "list",
		displayName: "List all channels",
		data: (target) => target.attr("data-id"),
		callback: list,
	});
}

function addBanListItem() {
	function banlist(itemData) {
		socket.emit("input", {
			target: parseInt(itemData, 10),
			text: "/banlist",
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("channel"),
		className: "list",
		displayName: "List banned users",
		data: (target) => target.attr("data-id"),
		callback: banlist,
	});
}

function addJoinItem() {
	function openJoinForm(itemData) {
		findChannel(Number(itemData)).network.isJoinChannelShown = true;
	}

	addContextMenuItem({
		check: (target) => target.hasClass("lobby"),
		className: "join",
		displayName: "Join a channel…",
		data: (target) => target.attr("data-id"),
		callback: openJoinForm,
	});
}

function addIgnoreListItem() {
	function ignorelist(itemData) {
		socket.emit("input", {
			target: parseInt(itemData, 10),
			text: "/ignorelist",
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("lobby"),
		className: "list",
		displayName: "List ignored users",
		data: (target) => target.attr("data-id"),
		callback: ignorelist,
	});
}

function addDefaultItems() {
	addFocusItem();
	addWhoisItem();
	addQueryItem();
	addKickItem();
	addOpItem();
	addDeopItem();
	addVoiceItem();
	addDevoiceItem();
	addEditNetworkItem();
	addJoinItem();
	addChannelListItem();
	addBanListItem();
	addIgnoreListItem();
	addConnectItem();
	addDisconnectItem();
	addCloseItem();
}
