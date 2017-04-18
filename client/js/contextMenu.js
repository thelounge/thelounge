"use strict";

const templates = require("../views");
const $ = require("jquery");
const contextMenuContainer = $("#context-menu-container");
const contextMenu = $("#context-menu");
const viewport = $("#viewport");

function positionContextMenu(that, e) {
	var offset;
	var menuWidth = contextMenu.outerWidth();
	var menuHeight = contextMenu.outerHeight();

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

function showContextMenu(that, e) {
	var target = $(e.currentTarget);
	var output = "";

	if (target.hasClass("user")) {
		output = templates.contextmenu_item({
			class: "user",
			text: target.text(),
			data: target.data("name")
		});
	} else if (target.hasClass("chan")) {
		output = templates.contextmenu_item({
			class: "chan",
			text: target.data("title"),
			data: target.data("target")
		});
		output += templates.contextmenu_divider();
		output += templates.contextmenu_item({
			class: "close",
			text: target.hasClass("lobby") ? "Disconnect" : target.hasClass("channel") ? "Leave" : "Close",
			data: target.data("target")
		});
	}

	contextMenuContainer.show();
	contextMenu
		.html(output)
		.css(positionContextMenu($(that), e));

	return false;
}

viewport.on("contextmenu", ".user, .network .chan", function(e) {
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

contextMenu.on("click", ".context-menu-item", function() {
	switch ($(this).data("action")) {
	case "close":
		$(".networks .chan[data-target='" + $(this).data("data") + "'] .close").click();
		break;
	case "chan":
		$(".networks .chan[data-target='" + $(this).data("data") + "']").click();
		break;
	case "user":
		$(".channel.active .users .user[data-name='" + $(this).data("data") + "']").click();
		break;
	}
});
