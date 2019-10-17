"use strict";

// vendor libraries
const $ = require("jquery");

// our libraries
const socket = require("./socket");

const {vueApp, findChannel} = require("./vue");

window.vueMounted = () => {
	require("./socket-events");
	const contextMenuFactory = require("./contextMenuFactory");
	const utils = require("./utils");
	require("./webpush");
	require("./keybinds");

	const sidebar = $("#sidebar, #footer");
	const viewport = $("#viewport");

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
		e.currentTarget = $(
			`#sidebar .chan[data-id="${$(this)
				.closest(".chan")
				.attr("data-id")}"]`
		)[0];
		return contextMenuFactory.createContextMenu($(this), e).show();
	});

	if (navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)) {
		$(document.body).addClass("is-apple");
	}

	const openWindow = function openWindow(e, {pushState, replaceHistory} = {}) {
		const self = $(this);
		const target = self.attr("data-target");

		if (!target) {
			return;
		}

		// This is a rather gross hack to account for sources that are in the
		// sidebar specifically. Needs to be done better when window management gets
		// refactored.
		const inSidebar = self.parents("#sidebar, #footer").length > 0;
		const channel = inSidebar ? findChannel(Number(self.attr("data-id"))) : null;

		if (vueApp.activeChannel) {
			const {channel: lastChannel} = vueApp.activeChannel;

			// If user clicks on the currently active channel, do nothing
			if (channel && lastChannel === channel.channel) {
				return;
			}

			if (lastChannel.messages.length > 0) {
				lastChannel.firstUnread = lastChannel.messages[lastChannel.messages.length - 1].id;
			}

			if (lastChannel.messages.length > 100) {
				lastChannel.messages.splice(0, lastChannel.messages.length - 100);
				lastChannel.moreHistoryAvailable = true;
			}
		}

		if (channel) {
			vueApp.$store.commit("activeWindow", null);
			vueApp.activeChannel = channel;

			if (channel) {
				channel.channel.highlight = 0;
				channel.channel.unread = 0;
			}

			socket.emit("open", channel ? channel.channel.id : null);

			if ($(window).outerWidth() <= utils.mobileViewportPixels) {
				vueApp.setSidebar(false);
			}
		} else {
			vueApp.activeChannel = null;
			const component = self.attr("data-component");
			vueApp.$store.commit("activeWindow", component);

			if ($(window).outerWidth() <= utils.mobileViewportPixels) {
				vueApp.setSidebar(false);
			}
		}

		utils.synchronizeNotifiedState();

		if (self.hasClass("chan")) {
			vueApp.$nextTick(() => $("#chat-container").addClass("active"));
		}

		/* TODO: move to ChatInput.vue
		const chanChat = chan.find(".chat");

		if (chanChat.length > 0 && channel.type !== "special") {
			// On touch devices unfocus (blur) the input to correctly close the virtual keyboard
			// An explicit blur is required, as the keyboard may open back up if the focus remains
			// See https://github.com/thelounge/thelounge/issues/2257
			$("#input").trigger("ontouchstart" in window ? "blur" : "focus");
		}
		*/

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
			state.clickTarget = `#sidebar .chan[data-id="${self.attr("data-id")}"]`;
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
	$("#windows").on("click", "#view-changelog, #back-to-help", openWindow);

	$(document).on("visibilitychange focus click", () => {
		utils.synchronizeNotifiedState();
	});

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
