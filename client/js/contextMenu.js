"use strict";
const $ = require("jquery");
const templates = require("../views");
let contextMenu, contextMenuContainer;

module.exports = class ContextMenu {
	constructor(contextMenuItems, contextMenuActions, selectedElement, event) {
		this.contextMenuItems = contextMenuItems;
		this.contextMenuActions = contextMenuActions;
		this.selectedElement = selectedElement;
		this.event = event;

		contextMenuContainer = $("#context-menu-container");
		contextMenu = $("#context-menu");
	}

	show() {
		showContextMenu(this.contextMenuItems, this.selectedElement, this.event);
		this.bindEvents();
		return false;
	}

	bindEvents() {
		const contextMenuActions = this.contextMenuActions;

		contextMenuActions.execute = (id, ...args) => contextMenuActions[id] && contextMenuActions[id](...args);

		contextMenu.find(".context-menu-item").on("click", function() {
			const $this = $(this);
			const itemData = $this.data("data");
			const contextAction = $this.data("action");
			contextMenuActions.execute(contextAction, itemData);
		});
	}
};

function showContextMenu(contextMenuItems, selectedElement, event) {
	const target = $(event.currentTarget);
	let output = "";

	for (const item of contextMenuItems) {
		if (item.check(target)) {
			if (item.divider) {
				output += templates.contextmenu_divider();
			} else {
				output += templates.contextmenu_item({
					class: typeof item.className === "function" ? item.className(target) : item.className,
					action: item.actionId,
					text: typeof item.displayName === "function" ? item.displayName(target) : item.displayName,
					data: typeof item.data === "function" ? item.data(target) : item.data,
				});
			}
		}
	}

	contextMenuContainer.show();
	contextMenu
		.html(output)
		.css(positionContextMenu(selectedElement, event));
}

function positionContextMenu(selectedElement, e) {
	let offset;
	const menuWidth = contextMenu.outerWidth();
	const menuHeight = contextMenu.outerHeight();

	if (selectedElement.hasClass("menu")) {
		offset = selectedElement.offset();
		offset.left -= menuWidth - selectedElement.outerWidth();
		offset.top += selectedElement.outerHeight();
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
