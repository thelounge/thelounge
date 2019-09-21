"use strict";

const $ = require("jquery");
const Mousetrap = require("mousetrap");

const contextMenuContainer = $("#context-menu-container");

module.exports = class ContextMenu {
	constructor(contextMenuItems, contextMenuActions, selectedElement, event) {
		this.previousActiveElement = document.activeElement;
		this.contextMenuItems = contextMenuItems;
		this.contextMenuActions = contextMenuActions;
		this.selectedElement = selectedElement;
		this.event = event;
	}

	show() {
		const contextMenu = showContextMenu(
			this.contextMenuItems,
			this.selectedElement,
			this.event
		);
		this.bindEvents(contextMenu);
		return false;
	}

	hide() {
		contextMenuContainer
			.hide()
			.empty()
			.off(".contextMenu");

		Mousetrap.unbind("escape");
	}

	bindEvents(contextMenu) {
		const contextMenuActions = this.contextMenuActions;

		contextMenuActions.execute = (id, ...args) =>
			contextMenuActions[id] && contextMenuActions[id](...args);

		const clickItem = (item) => {
			const itemData = item.attr("data-data");
			const contextAction = item.attr("data-action");

			this.hide();

			contextMenuActions.execute(contextAction, itemData);
		};

		contextMenu.on("click", ".context-menu-item", function() {
			clickItem($(this));
		});

		const trap = Mousetrap(contextMenu.get(0));

		trap.bind(["up", "down"], (e, key) => {
			const items = contextMenu.find(".context-menu-item");

			let index = items.toArray().findIndex((item) => $(item).is(":focus"));

			if (key === "down") {
				index = (index + 1) % items.length;
			} else {
				index = Math.max(index, 0) - 1;
			}

			items.eq(index).trigger("focus");
		});

		trap.bind("enter", () => {
			const item = contextMenu.find(".context-menu-item:focus");

			if (item.length) {
				clickItem(item);
			}

			return false;
		});

		// Hide context menu when clicking or right clicking outside of it
		contextMenuContainer.on("click.contextMenu contextmenu.contextMenu", (e) => {
			// Do not close the menu when clicking inside of the context menu (e.g. on a divider)
			if ($(e.target).prop("id") === "context-menu") {
				return;
			}

			this.hide();
			return false;
		});

		// Hide the context menu when pressing escape within the context menu container
		Mousetrap.bind("escape", () => {
			this.hide();

			// Return focus to the previously focused element
			$(this.previousActiveElement).trigger("focus");

			return false;
		});
	}
};

function showContextMenu(contextMenuItems, selectedElement, event) {
	const target = $(event.currentTarget);
	const contextMenu = $("<ul>", {
		id: "context-menu",
		role: "menu",
	});

	for (const item of contextMenuItems) {
		if (item.check(target)) {
			if (item.divider) {
				contextMenu.append('<li class="context-menu-divider" aria-hidden="true"></li>');
			} else {
				// <li class="context-menu-item context-menu-{{class}}" data-action="{{action}}"{{#if data}} data-data="{{data}}"{{/if}} tabindex="0" role="menuitem">{{text}}</li>
				contextMenu.append(
					$("<li>", {
						class:
							"context-menu-item context-menu-" +
							(typeof item.className === "function"
								? item.className(target)
								: item.className),
						text:
							typeof item.displayName === "function"
								? item.displayName(target)
								: item.displayName,
						"data-action": item.actionId,
						"data-data":
							typeof item.data === "function" ? item.data(target) : item.data,
						tabindex: 0,
						role: "menuitem",
					})
				);
			}
		}
	}

	contextMenuContainer.html(contextMenu).show();

	contextMenu
		.css(positionContextMenu(contextMenu, selectedElement, event))
		.find(".context-menu-item:first-child")
		.trigger("focus");

	return contextMenu;
}

function positionContextMenu(contextMenu, selectedElement, e) {
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

	if (window.innerWidth - offset.left < menuWidth) {
		offset.left = window.innerWidth - menuWidth;
	}

	if (window.innerHeight - offset.top < menuHeight) {
		offset.top = window.innerHeight - menuHeight;
	}

	return offset;
}
