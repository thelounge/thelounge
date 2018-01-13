"use strict";
const $ = require("jquery");
const socket = require("./socket");
const utils = require("./utils");
const templates = require("../views");
const JoinChannel = require("./join-channel");
const contextMenuActions = [];
const contextMenuItems = [];
let contextMenu, contextMenuContainer;

module.exports = {
	addContextMenuItem,
	setUpContextMenu,
};

/**
 *
 * @param opts
 * @param {function(Object)} [opts.check] - Function to check whether item should show on the context menu, called with the target jquery element, shows if return is truthy
 * @param {string|function(Object)} opts.className - class name for the menu item, should be prefixed for non-default menu items (if function, called with jquery element, and uses return value)
 * @param {string|function(Object)} opts.data - data that will be sent to the callback function (if function, called with jquery element, and uses return value)
 * @param {string|function(Object)} opts.display - text to display on the menu item (if function, called with jquery element, and uses return value)
 * @param {boolean} [opts.divider] - Whether to put a divider after this option in the menu
 * @param {function(Object)} opts.callback - Function to call when the context menu item is clicked, called with the data requested in opts.data
 */
function addContextMenuItem(opts) {
	opts.check = opts.check || (() => true);
	opts.actionId = contextMenuActions.push(opts.callback) - 1;
	contextMenuItems.push(opts);
}

function setUpContextMenu() {
	contextMenuContainer = $("#context-menu-container");
	contextMenu = $("#context-menu");
	const viewport = $("#viewport");

	viewport.on("contextmenu", ".network .chan", function(e) {
		return showContextMenu(this, e);
	});

	viewport.on("click contextmenu", ".user", function(e) {
		return showContextMenu(this, e);
	});

	viewport.on("click", "#chat .menu", function(e) {
		e.currentTarget = $(e.currentTarget).closest(".chan")[0];
		return showContextMenu(this, e);
	});

	contextMenuContainer.on("click contextmenu", function() {
		contextMenuContainer.hide();
		return false;
	});

	contextMenuActions.execute = (id, ...args) => contextMenuActions[id] && contextMenuActions[id](...args);

	contextMenu.on("click", ".context-menu-item", function() {
		const $this = $(this);
		const itemData = $this.data("data");
		const contextAction = $this.data("action");
		contextMenuActions.execute(contextAction, itemData);
	});
}

function showContextMenu(that, e) {
	const target = $(e.currentTarget);
	let output = "";

	for (const item of contextMenuItems) {
		if (item.check(target)) {
			output += templates.contextmenu_item({
				class: typeof item.className === "function" ? item.className(target) : item.className,
				action: item.actionId,
				text: typeof item.display === "function" ? item.display(target) : item.display,
				data: typeof item.data === "function" ? item.data(target) : item.data,
			});
			if (item.divider) {
				output += templates.contextmenu_divider();
			}
		}
	}

	contextMenuContainer.show();
	contextMenu
		.html(output)
		.css(positionContextMenu($(that), e));

	return false;
}

function positionContextMenu(that, e) {
	let offset;
	const menuWidth = contextMenu.outerWidth();
	const menuHeight = contextMenu.outerHeight();

	if (that.hasClass("menu")) {
		offset = that.offset();
		offset.left -= menuWidth - that.outerWidth();
		offset.top += that.outerHeight();
		return offset;
	}

	offset = {left: e.pageX, top: e.pageY};

	if ((window.innerWidth - offset.left) < menuWidth) {
		offset.left = window.innerWidth - menuWidth;
	}

	if ((window.innerHeight - offset.top) < menuHeight) {
		offset.top = window.innerHeight - menuHeight;
	}

	return offset;
}

addDefaultContextMenuItems();

function addDefaultContextMenuItems() {
	function whois(itemData) {
		const chan = utils.findCurrentNetworkChan(itemData);

		if (chan.length) {
			chan.click();
		}

		socket.emit("input", {
			target: $("#chat").data("id"),
			text: "/whois " + itemData,
		});

		$(`.channel.active .users .user[data-name="${itemData}"]`).click();
	}

	addContextMenuItem({
		check: (target) => target.hasClass("user"),
		className: "user",
		display: (target) => target.text(),
		data: (target) => target.data("name"),
		divider: true,
		callback: whois,
	});

	addContextMenuItem({
		check: (target) => target.hasClass("user"),
		className: "action-whois",
		display: "User information",
		data: (target) => target.data("name"),
		callback: whois,
	});

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
		display: "Direct messages",
		data: (target) => target.data("name"),
		callback: query,
	});

	function kick(itemData) {
		socket.emit("input", {
			target: $("#chat").data("id"),
			text: "/kick " + itemData,
		});
	}

	addContextMenuItem({
		check: (target) => utils.isOpInChannel(target.closest(".chan")) && target.closest(".chan").data("type") === "channel",
		className: "action-kick",
		display: "Kick",
		data: (target) => target.data("name"),
		callback: kick,
	});

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
		display: (target) => target.data("title"),
		data: (target) => target.data("target"),
		divider: true,
		callback: focusChan,
	});

	function list(itemData) {
		socket.emit("input", {
			target: itemData,
			text: "/list",
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("lobby"),
		className: "list",
		display: "List all channels",
		data: (target) => target.data("id"),
		callback: list,
	});

	function banlist(itemData) {
		socket.emit("input", {
			target: itemData,
			text: "/banlist",
		});
	}

	addContextMenuItem({
		check: (target) => target.hasClass("channel"),
		className: "list",
		display: "List banned users",
		data: (target) => target.data("id"),
		callback: banlist,
	});

	function join(itemData) {
		const network = $(`#join-channel-${itemData}`).closest(".network");
		JoinChannel.openForm(network);
	}

	addContextMenuItem({
		check: (target) => target.hasClass("lobby"),
		className: "join",
		display: "Join a channel…",
		data: (target) => target.data("id"),
		callback: join,
	});
}
