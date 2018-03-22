"use strict";

// vendor libraries
require("jquery-ui/ui/widgets/sortable");
const $ = require("jquery");
const moment = require("moment");
const URI = require("urijs");

// our libraries
require("./libs/jquery/stickyscroll");
const slideoutMenu = require("./slideout");
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
const contextMenuFactory = require("./contextMenuFactory");
const contextMenuContainer = $("#context-menu-container");

$(function() {
	const sidebar = $("#sidebar, #footer");
	const chat = $("#chat");

	$(document.body).data("app-name", document.title);

	const viewport = $("#viewport");

	function storeSidebarVisibility(name, state) {
		if ($(window).outerWidth() < utils.mobileViewportPixels) {
			return;
		}

		storage.set(name, state);
	}

	// If sidebar overlay is visible and it is clicked, close the sidebar
	$("#sidebar-overlay").on("click", () => {
		slideoutMenu.toggle(false);
		storeSidebarVisibility("thelounge.state.sidebar", false);
	});

	$("#windows").on("click", "button.lt", () => {
		const isOpen = !slideoutMenu.isOpen();

		slideoutMenu.toggle(isOpen);
		storeSidebarVisibility("thelounge.state.sidebar", isOpen);
		utils.togglePreviewMoreButtonsIfNeeded();
	});

	viewport.on("click", ".rt", function() {
		const isOpen = !viewport.hasClass("rt");

		viewport.toggleClass("rt", isOpen);
		chat.find(".chan.active .chat").trigger("keepToBottom");
		storeSidebarVisibility("thelounge.state.userlist", isOpen);
		utils.togglePreviewMoreButtonsIfNeeded();

		return false;
	});

	viewport.on("contextmenu", ".network .chan", function(e) {
		return contextMenuFactory.createContextMenu($(this), e).show();
	});

	viewport.on("click contextmenu", ".user", function(e) {
		// If user is selecting text, do not open context menu
		// This primarily only targets mobile devices where selection is performed with touch
		if (!window.getSelection().isCollapsed) {
			return true;
		}

		return contextMenuFactory.createContextMenu($(this), e).show();
	});

	viewport.on("click", "#chat .menu", function(e) {
		e.currentTarget = $(`#sidebar .chan[data-id="${$(this).closest(".chan").data("id")}"]`)[0];
		return contextMenuFactory.createContextMenu($(this), e).show();
	});

	contextMenuContainer.on("click contextmenu", function() {
		contextMenuContainer.hide();
		return false;
	});

	function resetInputHeight(input) {
		input.style.height = input.style.minHeight;
	}

	const input = $("#input")
		.on("input", function() {
			const style = window.getComputedStyle(this);

			// Start by resetting height before computing as scrollHeight does not
			// decrease when deleting characters
			resetInputHeight(this);

			this.style.height = Math.min(
				Math.round(window.innerHeight - 100), // prevent overflow
				this.scrollHeight
				+ Math.round(parseFloat(style.borderTopWidth) || 0)
				+ Math.round(parseFloat(style.borderBottomWidth) || 0)
			) + "px";

			chat.find(".chan.active .chat").trigger("keepToBottom"); // fix growing
		});

	if (navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)) {
		$(document.body).addClass("is-apple");
	}

	$("#form").on("submit", function() {
		// Triggering click event opens the virtual keyboard on mobile
		// This can only be called from another interactive event (e.g. button click)
		input.trigger("click").trigger("focus");

		const target = chat.data("id");
		const text = input.val();

		if (text.length === 0) {
			return false;
		}

		input.val("");
		resetInputHeight(input.get(0));

		if (text.charAt(0) === "/") {
			const args = text.substr(1).split(" ");
			const cmd = args.shift().toLowerCase();

			if (typeof utils.inputCommands[cmd] === "function" && utils.inputCommands[cmd](args)) {
				return false;
			}
		}

		socket.emit("input", {target, text});

		return false;
	});

	$("button#set-nick").on("click", function() {
		utils.toggleNickEditor(true);

		// Selects existing nick in the editable text field
		const element = document.querySelector("#nick-value");
		element.focus();
		const range = document.createRange();
		range.selectNodeContents(element);
		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	});

	$("button#cancel-nick").on("click", cancelNick);
	$("button#submit-nick").on("click", submitNick);

	function submitNick() {
		const newNick = $("#nick-value").text().trim();

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

	$("#nick-value").on("keypress", function(e) {
		switch (e.keyCode ? e.keyCode : e.which) {
		case 13: // Enter
			// Ensures a new line is not added when pressing Enter
			e.preventDefault();
			break;
		}
	}).on("keyup", function(e) {
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
		const name = $(this).data("chan");
		const chan = utils.findCurrentNetworkChan(name);

		if (chan.length) {
			chan.trigger("click");
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

	const openWindow = function openWindow(e, {keepSidebarOpen, pushState, replaceHistory} = {}) {
		const self = $(this);
		const target = self.data("target");

		if (!target) {
			return false;
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

			sidebar.find(".active")
				.removeClass("active")
				.attr("aria-selected", false);

			self.addClass("active")
				.attr("aria-selected", true)
				.find(".badge")
				.removeClass("highlight")
				.empty();

			if (sidebar.find(".highlight").length === 0) {
				utils.toggleNotificationMarkers(false);
			}

			if (!keepSidebarOpen && $(window).outerWidth() < utils.mobileViewportPixels) {
				slideoutMenu.toggle(false);
			}

			utils.togglePreviewMoreButtonsIfNeeded();
		}

		const lastActive = $("#windows > .active");

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

		const chan = $(target)
			.addClass("active")
			.trigger("show");

		let title = $(document.body).data("app-name");
		const chanTitle = chan.attr("aria-label");

		if (chanTitle.length > 0) {
			title = `${chanTitle} — ${title}`;
		}

		document.title = title;

		const type = chan.data("type");
		let placeholder = "";

		if (type === "channel" || type === "query") {
			placeholder = `Write to ${chanTitle}`;
		}

		input
			.prop("placeholder", placeholder)
			.attr("aria-label", placeholder);

		if (self.hasClass("chan")) {
			$("#chat-container").addClass("active");
			utils.setNick(self.closest(".network").data("nick"));
		}

		const chanChat = chan.find(".chat");

		if (chanChat.length > 0 && type !== "special") {
			chanChat.sticky();

			// On touch devices unfocus (blur) the input to correctly close the virtual keyboard
			// An explicit blur is required, as the keyboard may open back up if the focus remains
			// See https://github.com/thelounge/thelounge/issues/2257
			input.trigger("ontouchstart" in window ? "blur" : "focus");
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

		// Pushes states to history web API when clicking elements with a data-target attribute.
		// States are very trivial and only contain a single `clickTarget` property which
		// contains a CSS selector that targets elements which takes the user to a different view
		// when clicked. The `popstate` event listener will trigger synthetic click events using that
		// selector and thus take the user to a different view/state.
		if (pushState === false) {
			return false;
		}

		const state = {};

		if (self.prop("id")) {
			state.clickTarget = `#${self.prop("id")}`;
		} else if (self.hasClass("chan")) {
			state.clickTarget = `#sidebar .chan[data-id="${self.data("id")}"]`;
		} else {
			state.clickTarget = `#footer button[data-target="${target}"]`;
		}

		if (history && history.pushState) {
			if (replaceHistory && history.replaceState) {
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

	function closeChan(chan) {
		let cmd = "/close";

		if (chan.hasClass("lobby")) {
			cmd = "/quit";
			const server = chan.find(".name").html();

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

	const getCloseDisplay = (target) => {
		if (target.hasClass("lobby")) {
			return "Disconnect";
		} else if (target.hasClass("channel")) {
			return "Leave";
		}

		return "Close";
	};

	contextMenuFactory.addContextMenuItem({
		check: (target) => target.hasClass("chan"),
		className: "close",
		displayName: getCloseDisplay,
		data: (target) => target.data("target"),
		callback: (itemData) => closeChan($(`.networks .chan[data-target="${itemData}"]`)),
	});

	if ($(document.body).hasClass("public") && (window.location.hash === "#connect" || window.location.hash === "")) {
		$("#connect").one("show", function() {
			const params = URI(document.location.search).search(true);

			if ("channels" in params) {
				params.join = params.channels;
			}

			// Possible parameters:  name, host, port, password, tls, nick, username, realname, join
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in#Iterating_over_own_properties_only
			for (let key in params) {
				if (params.hasOwnProperty(key)) {
					let value = params[key];

					if (key === "join") {
						const channels = value.split(",");
						value = channels.map((c) => {
							if (c.match(/^\w/)) {
								return "#" + c;
							}

							return c;
						}).join(",");
					}

					// \W searches for non-word characters
					key = key.replace(/\W/g, "");

					const element = $("#connect input[name='" + key + "']");

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
