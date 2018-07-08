"use strict";

// vendor libraries
const $ = require("jquery");
const moment = require("moment");

// our libraries
const socket = require("./socket");

const {vueApp, findChannel} = require("./vue");

window.vueMounted = () => {
	require("./socket-events");
	require("./libs/jquery/stickyscroll");
	const slideoutMenu = require("./slideout");
	const templates = require("../views");
	const contextMenuFactory = require("./contextMenuFactory");
	const storage = require("./localStorage");
	const utils = require("./utils");
	require("./webpush");
	require("./keybinds");
	require("./clipboard");

	const sidebar = $("#sidebar, #footer");
	const chat = $("#chat");

	const viewport = $("#viewport");

	function storeSidebarVisibility(name, state) {
		storage.set(name, state);

		utils.togglePreviewMoreButtonsIfNeeded();
	}

	// If sidebar overlay is visible and it is clicked, close the sidebar
	$("#sidebar-overlay").on("click", () => {
		slideoutMenu.toggle(false);

		if ($(window).outerWidth() > utils.mobileViewportPixels) {
			storeSidebarVisibility("thelounge.state.sidebar", false);
		}
	});

	$("#windows").on("click", "button.lt", () => {
		const isOpen = !slideoutMenu.isOpen();

		slideoutMenu.toggle(isOpen);

		if ($(window).outerWidth() > utils.mobileViewportPixels) {
			storeSidebarVisibility("thelounge.state.sidebar", isOpen);
		}
	});

	viewport.on("click", ".rt", function() {
		const isOpen = !viewport.hasClass("userlist-open");

		viewport.toggleClass("userlist-open", isOpen);
		chat.find(".chan.active .chat").trigger("keepToBottom");
		storeSidebarVisibility("thelounge.state.userlist", isOpen);

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

	chat.on("click", ".inline-channel", function() {
		const name = $(this).attr("data-chan");
		const chan = utils.findCurrentNetworkChan(name);

		if (chan.length) {
			chan.trigger("click");
		}

		socket.emit("input", {
			target: chat.data("id"),
			text: "/join " + name,
		});
	});

	chat.on("click", ".condensed-summary .content", function() {
		$(this).closest(".msg.condensed").toggleClass("closed");
	});

	const openWindow = function openWindow(e, {keepSidebarOpen, pushState, replaceHistory} = {}) {
		const self = $(this);
		const target = self.attr("data-target");

		if (!target) {
			return;
		}

		// This is a rather gross hack to account for sources that are in the
		// sidebar specifically. Needs to be done better when window management gets
		// refactored.
		const inSidebar = self.parents("#sidebar, #footer").length > 0;
		let channel;

		if (inSidebar) {
			chat.data(
				"id",
				self.data("id")
			);
			socket.emit(
				"open",
				self.data("id")
			);

			channel = findChannel(self.data("id"));

			vueApp.activeChannel = channel;

			if (channel) {
				channel.channel.highlight = 0;
				channel.channel.unread = 0;
			}

			let hasAnyHighlights = false;

			for (const network of vueApp.networks) {
				for (const channel of network.channels) {
					if (channel.highlight > 0) {
						hasAnyHighlights = true;
						break;
					}
				}
			}

			if (!hasAnyHighlights) {
				utils.toggleNotificationMarkers(false);
			}

			if (!keepSidebarOpen && $(window).outerWidth() <= utils.mobileViewportPixels) {
				slideoutMenu.toggle(false);
			}
		}

		const lastActive = $("#windows > .active");

		lastActive
			.removeClass("active");

		/*const lastActiveChan = lastActive.find(".chan.active");

		if (lastActiveChan.length > 0) {
			lastActiveChan
				.removeClass("active")
				.find(".unread-marker")
				.data("unread-id", 0)
				.appendTo(lastActiveChan.find(".messages"));

			render.trimMessageInChannel(lastActiveChan, 100);
		}*/

		const chan = $(target)
			.addClass("active")
			.trigger("show");

		utils.togglePreviewMoreButtonsIfNeeded();
		utils.updateTitle();

		const type = chan.data("type");

		if (self.hasClass("chan")) {
			vueApp.$nextTick(() => $("#chat-container").addClass("active"));
		}

		const chanChat = chan.find(".chat");

		if (chanChat.length > 0 && type !== "special") {
			chanChat.sticky();

			// On touch devices unfocus (blur) the input to correctly close the virtual keyboard
			// An explicit blur is required, as the keyboard may open back up if the focus remains
			// See https://github.com/thelounge/thelounge/issues/2257
			input.trigger("ontouchstart" in window ? "blur" : "focus");
		}

		if (channel && channel.channel.usersOutdated) {
			channel.channel.usersOutdated = false;

			socket.emit("names", {
				target: channel.channel.id,
			});
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

	sidebar.on("click", ".close", function() {
		utils.closeChan($(this).closest(".chan"));
	});

	$(document).on("visibilitychange focus click", () => {
		for (const network of vueApp.networks) {
			for (const channel of network.channels) {
				if (channel.highlight > 0) {
					return;
				}
			}
		}

		utils.toggleNotificationMarkers(false);
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
};
