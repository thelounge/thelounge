"use strict";

// vendor libraries
require("jquery-ui/ui/widgets/sortable");
const $ = require("jquery");
const moment = require("moment");
const URI = require("urijs");
const fuzzy = require("fuzzy");

// our libraries
require("./libs/jquery/inputhistory");
require("./libs/jquery/stickyscroll");
const slideoutMenu = require("./libs/slideout");
const templates = require("../views");
const socket = require("./socket");
const render = require("./render");
require("./socket-events");
const storage = require("./localStorage");
const utils = require("./utils");
require("./webpush");
require("./keybinds");
require("./clipboard");
const Changelog = require("./socket-events/changelog");
const JoinChannel = require("./join-channel");

$(function() {
	var sidebar = $("#sidebar, #footer");
	var chat = $("#chat");

	$(document.body).data("app-name", document.title);

	var viewport = $("#viewport");
	var sidebarSlide = slideoutMenu(viewport[0], sidebar[0]);
	var contextMenuContainer = $("#context-menu-container");
	var contextMenu = $("#context-menu");

	$("#main").on("click", function(e) {
		if ($(e.target).is(".lt")) {
			sidebarSlide.toggle(!sidebarSlide.isOpen());
		} else if (sidebarSlide.isOpen()) {
			sidebarSlide.toggle(false);
		}
	});

	viewport.on("click", ".rt", function(e) {
		var self = $(this);
		viewport.toggleClass(self.attr("class"));
		e.stopPropagation();
		chat.find(".chan.active .chat").trigger("msg.sticky");
	});

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
				action: "whois",
				text: target.text(),
				data: target.data("name"),
			});
			output += templates.contextmenu_divider();
			output += templates.contextmenu_item({
				class: "action-whois",
				action: "whois",
				text: "User information",
				data: target.data("name"),
			});
			output += templates.contextmenu_item({
				class: "action-query",
				action: "query",
				text: "Direct messages",
				data: target.data("name"),
			});

			const channel = target.closest(".chan");
			if (utils.isOpInChannel(channel) && channel.data("type") === "channel") {
				output += templates.contextmenu_divider();
				output += templates.contextmenu_item({
					class: "action-kick",
					action: "kick",
					text: "Kick",
					data: target.data("name"),
				});
			}
		} else if (target.hasClass("chan")) {
			let itemClass;

			if (target.hasClass("lobby")) {
				itemClass = "network";
			} else if (target.hasClass("query")) {
				itemClass = "query";
			} else {
				itemClass = "chan";
			}

			output = templates.contextmenu_item({
				class: itemClass,
				action: "focusChan",
				text: target.data("title"),
				data: target.data("target"),
			});
			output += templates.contextmenu_divider();
			if (target.hasClass("lobby")) {
				output += templates.contextmenu_item({
					class: "list",
					action: "list",
					text: "List all channels",
					data: target.data("id"),
				});
				output += templates.contextmenu_item({
					class: "join",
					action: "join",
					text: "Join a channel…",
					data: target.data("id"),
				});
			}
			if (target.hasClass("channel")) {
				output += templates.contextmenu_item({
					class: "list",
					action: "banlist",
					text: "List banned users",
					data: target.data("id"),
				});
			}
			output += templates.contextmenu_item({
				class: "close",
				action: "close",
				text: target.hasClass("lobby") ? "Disconnect" : target.hasClass("channel") ? "Leave" : "Close",
				data: target.data("target"),
			});
		}

		contextMenuContainer.show();
		contextMenu
			.html(output)
			.css(positionContextMenu($(that), e));

		return false;
	}

	viewport.on("contextmenu", ".network .chan", function(e) {
		return showContextMenu(this, e);
	});

	viewport.on("click contextmenu", ".user", function(e) {
		// If user is selecting text, do not open context menu
		// This primarily only targets mobile devices where selection is performed with touch
		if (!window.getSelection().isCollapsed) {
			return true;
		}

		return showContextMenu(this, e);
	});

	viewport.on("click", "#chat .menu", function(e) {
		e.currentTarget = $(`#sidebar .chan[data-id="${$(this).closest(".chan").data("id")}"]`)[0];
		return showContextMenu(this, e);
	});

	contextMenuContainer.on("click contextmenu", function() {
		contextMenuContainer.hide();
		return false;
	});

	function resetInputHeight(input) {
		input.style.height = input.style.minHeight;
	}

	var input = $("#input")
		.history()
		.on("input", function() {
			var style = window.getComputedStyle(this);

			// Start by resetting height before computing as scrollHeight does not
			// decrease when deleting characters
			resetInputHeight(this);

			this.style.height = Math.min(
				Math.round(window.innerHeight - 100), // prevent overflow
				this.scrollHeight
				+ Math.round(parseFloat(style.borderTopWidth) || 0)
				+ Math.round(parseFloat(style.borderBottomWidth) || 0)
			) + "px";

			chat.find(".chan.active .chat").trigger("msg.sticky"); // fix growing
		});

	var focus = $.noop;
	if (!("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
		focus = function() {
			if (chat.find(".active").hasClass("chan")) {
				input.focus();
			}
		};

		$(window).on("focus", focus);

		chat.on("click", ".chat", function() {
			setTimeout(function() {
				if (window.getSelection().isCollapsed) {
					focus();
				}
			}, 2);
		});
	}

	if (navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)) {
		$(document.body).addClass("is-apple");
	}

	$("#form").on("submit", function(e) {
		e.preventDefault();
		utils.forceFocus();
		var text = input.val();

		if (text.length === 0) {
			return;
		}

		input.val("");
		resetInputHeight(input.get(0));

		if (text.charAt(0) === "/") {
			const args = text.substr(1).split(" ");
			const cmd = args.shift().toLowerCase();
			if (typeof utils.inputCommands[cmd] === "function" && utils.inputCommands[cmd](args)) {
				return;
			}
		}

		socket.emit("input", {
			target: chat.data("id"),
			text: text,
		});
	});

	$("button#set-nick").on("click", function() {
		utils.toggleNickEditor(true);

		// Selects existing nick in the editable text field
		var element = document.querySelector("#nick-value");
		element.focus();
		var range = document.createRange();
		range.selectNodeContents(element);
		var selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	});

	$("button#cancel-nick").on("click", cancelNick);
	$("button#submit-nick").on("click", submitNick);

	function submitNick() {
		var newNick = $("#nick-value").text().trim();

		if (newNick.length === 0) {
			cancelNick();
			return;
		}

		utils.toggleNickEditor(false);

		socket.emit("input", {
			target: chat.data("id"),
			text: "/nick " + newNick,
		});
	}

	function cancelNick() {
		utils.setNick(sidebar.find(".chan.active").closest(".network").data("nick"));
	}

	$("#nick-value").keypress(function(e) {
		switch (e.keyCode ? e.keyCode : e.which) {
		case 13: // Enter
			// Ensures a new line is not added when pressing Enter
			e.preventDefault();
			break;
		}
	}).keyup(function(e) {
		switch (e.keyCode ? e.keyCode : e.which) {
		case 13: // Enter
			submitNick();
			break;
		case 27: // Escape
			cancelNick();
			break;
		}
	});

	chat.on("click", ".inline-channel", function() {
		var name = $(this).data("chan");
		var chan = utils.findCurrentNetworkChan(name);

		if (chan.length) {
			chan.click();
		} else {
			socket.emit("input", {
				target: chat.data("id"),
				text: "/join " + name,
			});
		}
	});

	chat.on("click", ".condensed-summary .content", function() {
		$(this).closest(".msg.condensed").toggleClass("closed");
	});

	const openWindow = function openWindow(e, data) {
		var self = $(this);
		var target = self.data("target");
		if (!target) {
			return;
		}

		// This is a rather gross hack to account for sources that are in the
		// sidebar specifically. Needs to be done better when window management gets
		// refactored.
		const inSidebar = self.parents("#sidebar, #footer").length > 0;

		if (inSidebar) {
			chat.data(
				"id",
				self.data("id")
			);
			socket.emit(
				"open",
				self.data("id")
			);

			sidebar.find(".active").removeClass("active");
			self.addClass("active")
				.find(".badge")
				.removeClass("highlight")
				.empty();

			if (sidebar.find(".highlight").length === 0) {
				utils.toggleNotificationMarkers(false);
			}

			sidebarSlide.toggle(false);
		}

		var lastActive = $("#windows > .active");

		lastActive
			.removeClass("active")
			.find(".chat")
			.unsticky();

		const lastActiveChan = lastActive.find(".chan.active");

		if (lastActiveChan.length > 0) {
			lastActiveChan
				.removeClass("active")
				.find(".unread-marker")
				.data("unread-id", 0)
				.appendTo(lastActiveChan.find(".messages"));

			render.trimMessageInChannel(lastActiveChan, 100);
		}

		var chan = $(target)
			.addClass("active")
			.trigger("show");

		let title = $(document.body).data("app-name");
		if (chan.data("title")) {
			title = chan.data("title") + " — " + title;
		}
		document.title = title;

		const type = chan.data("type");
		var placeholder = "";
		if (type === "channel" || type === "query") {
			placeholder = `Write to ${chan.data("title")}`;
		}
		input.attr("placeholder", placeholder).attr("aria-label", placeholder);

		if (self.hasClass("chan")) {
			$("#chat-container").addClass("active");
			utils.setNick(self.closest(".network").data("nick"));
		}

		var chanChat = chan.find(".chat");
		if (chanChat.length > 0 && type !== "special") {
			chanChat.sticky();
		}

		if (chan.data("needsNamesRefresh") === true) {
			chan.data("needsNamesRefresh", false);
			socket.emit("names", {target: self.data("id")});
		}

		if (target === "#settings") {
			$("#session-list").html("<p>Loading…</p>");
			socket.emit("sessions:get");
		}

		if (target === "#help" || target === "#changelog") {
			Changelog.requestIfNeeded();
		}

		focus();

		// Pushes states to history web API when clicking elements with a data-target attribute.
		// States are very trivial and only contain a single `clickTarget` property which
		// contains a CSS selector that targets elements which takes the user to a different view
		// when clicked. The `popstate` event listener will trigger synthetic click events using that
		// selector and thus take the user to a different view/state.
		if (data && data.pushState === false) {
			return;
		}
		const state = {};

		if (self.attr("id")) {
			state.clickTarget = `#${self.attr("id")}`;
		} else if (self.hasClass("chan")) {
			state.clickTarget = `#sidebar .chan[data-id="${self.data("id")}"]`;
		} else {
			state.clickTarget = `#footer button[data-target="${target}"]`;
		}

		if (history && history.pushState) {
			if (data && data.replaceHistory && history.replaceState) {
				history.replaceState(state, null, target);
			} else {
				history.pushState(state, null, target);
			}
		}

		return false;
	};

	sidebar.on("click", ".chan, button", openWindow);
	$("#help").on("click", "#view-changelog, #back-to-help", openWindow);
	$("#changelog").on("click", "#back-to-help", openWindow);

	sidebar.on("click", "#sign-out", function() {
		socket.emit("sign-out");
		storage.remove("token");

		if (!socket.connected) {
			location.reload();
		}
	});

	function closeChan(chan) {
		var cmd = "/close";

		if (chan.hasClass("lobby")) {
			cmd = "/quit";
			var server = chan.find(".name").html();
			if (!confirm("Disconnect from " + server + "?")) { // eslint-disable-line no-alert
				return false;
			}
		}
		socket.emit("input", {
			target: chan.data("id"),
			text: cmd,
		});
		chan.css({
			transition: "none",
			opacity: 0.4,
		});
		return false;
	}

	sidebar.on("click", ".close", function() {
		closeChan($(this).closest(".chan"));
	});

	const contextMenuActions = {
		join: function(itemData) {
			const network = $(`#join-channel-${itemData}`).closest(".network");
			JoinChannel.openForm(network);
		},
		close: function(itemData) {
			closeChan($(`.networks .chan[data-target="${itemData}"]`));
		},
		focusChan: function(itemData) {
			$(`.networks .chan[data-target="${itemData}"]`).click();
		},
		list: function(itemData) {
			socket.emit("input", {
				target: itemData,
				text: "/list",
			});
		},
		banlist: function(itemData) {
			socket.emit("input", {
				target: itemData,
				text: "/banlist",
			});
		},
		whois: function(itemData) {
			const chan = utils.findCurrentNetworkChan(itemData);

			if (chan.length) {
				chan.click();
			}

			socket.emit("input", {
				target: $("#chat").data("id"),
				text: "/whois " + itemData,
			});

			$(`.channel.active .users .user[data-name="${itemData}"]`).click();
		},
		query: function(itemData) {
			const chan = utils.findCurrentNetworkChan(itemData);

			if (chan.length) {
				chan.click();
			}

			socket.emit("input", {
				target: $("#chat").data("id"),
				text: "/query " + itemData,
			});
		},
		kick: function(itemData) {
			socket.emit("input", {
				target: $("#chat").data("id"),
				text: "/kick " + itemData,
			});
		},
	};

	contextMenuActions.execute = (name, ...args) => contextMenuActions[name] && contextMenuActions[name](...args);

	contextMenu.on("click", ".context-menu-item", function() {
		const $this = $(this);
		const itemData = $this.data("data");
		const contextAction = $this.data("action");
		contextMenuActions.execute(contextAction, itemData);
	});

	chat.on("input", ".search", function() {
		const value = $(this).val();
		const parent = $(this).closest(".users");
		const names = parent.find(".names-original");
		const container = parent.find(".names-filtered");

		if (!value.length) {
			container.hide();
			names.show();
			return;
		}

		const fuzzyOptions = {
			pre: "<b>",
			post: "</b>",
			extract: (el) => $(el).text(),
		};

		const result = fuzzy.filter(
			value,
			names.find(".user").toArray(),
			fuzzyOptions
		);

		names.hide();
		container.html(templates.user_filtered({matches: result})).show();
	});

	if ($("body").hasClass("public") && (window.location.hash === "#connect" || window.location.hash === "")) {
		$("#connect").one("show", function() {
			var params = URI(document.location.search);
			params = params.search(true);
			// Possible parameters:  name, host, port, password, tls, nick, username, realname, join
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in#Iterating_over_own_properties_only
			for (var key in params) {
				if (params.hasOwnProperty(key)) {
					var value = params[key];
					// \W searches for non-word characters
					key = key.replace(/\W/g, "");

					var element = $("#connect input[name='" + key + "']");
					// if the element exists, it isn't disabled, and it isn't hidden
					if (element.length > 0 && !element.is(":disabled") && !element.is(":hidden")) {
						if (element.is(":checkbox")) {
							element.prop("checked", (value === "1" || value === "true") ? true : false);
						} else {
							element.val(value);
						}
					}
				}
			}
		});
	}

	$(document).on("visibilitychange focus click", () => {
		if (sidebar.find(".highlight").length === 0) {
			utils.toggleNotificationMarkers(false);
		}
	});

	// Compute how many milliseconds are remaining until the next day starts
	function msUntilNextDay() {
		return moment().add(1, "day").startOf("day") - moment();
	}

	// Go through all Today/Yesterday date markers in the DOM and recompute their
	// labels. When done, restart the timer for the next day.
	function updateDateMarkers() {
		$(".date-marker-text[data-label='Today'], .date-marker-text[data-label='Yesterday']")
			.closest(".date-marker-container")
			.each(function() {
				$(this).replaceWith(templates.date_marker({time: $(this).data("time")}));
			});

		// This should always be 24h later but re-computing exact value just in case
		setTimeout(updateDateMarkers, msUntilNextDay());
	}
	setTimeout(updateDateMarkers, msUntilNextDay());

	window.addEventListener("popstate", (e) => {
		const {state} = e;
		if (!state) {
			return;
		}

		let {clickTarget} = state;

		if (clickTarget) {
			// This will be true when click target corresponds to opening a thumbnail,
			// browsing to the previous/next thumbnail, or closing the image viewer.
			const imageViewerRelated = clickTarget.includes(".toggle-thumbnail");

			// If the click target is not related to the image viewer but the viewer
			// is currently opened, we need to close it.
			if (!imageViewerRelated && $("#image-viewer").hasClass("opened")) {
				clickTarget += ", #image-viewer";
			}

			// Emit the click to the target, while making sure it is not going to be
			// added to the state again.
			$(clickTarget).trigger("click", {
				pushState: false,
			});
		}
	});

	// Only start opening socket.io connection after all events have been registered
	socket.open();
});
