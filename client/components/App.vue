<template>
	<div id="viewport" :class="viewportClasses" role="tablist">
		<Sidebar v-if="$store.state.appLoaded" :overlay="$refs.overlay" />
		<div
			id="sidebar-overlay"
			ref="overlay"
			aria-hidden="true"
			@click="$store.commit('sidebarOpen', false)"
		/>
		<router-view ref="window"></router-view>
		<Mentions />
		<ImageViewer ref="imageViewer" />
		<ContextMenu ref="contextMenu" />
		<ConfirmDialog ref="confirmDialog" />
		<div id="upload-overlay"></div>
	</div>
</template>

<style>
@import "../css/icons.css";
@import "../css/chat-and-search.css";
@import "../css/chat-messages.css";

/* Global styles */
.container {
	padding: 0 15px;
	margin-bottom: 20px;
	width: var(--page-content-width);
	align-self: center;
	touch-action: pan-y;
}

.window li,
.window p,
.window label,
#settings .error {
	font-size: 14px;
}

.window {
	background: var(--window-bg-color);
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	position: relative;
	overflow-y: auto;
	height: 100%;
	scrollbar-width: thin;
	overscroll-behavior: contain;
	-webkit-overflow-scrolling: touch;
}

#loading,
#chat .chat-view {
	/* flexbox does not seem to scroll without doing this */
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
}

.window h1 {
	font-size: 36px;
}

.window h2 {
	border-bottom: 1px solid currentcolor;
	color: var(--window-heading-color);
	font-size: 22px;
	margin: 30px 0 10px;
	padding-bottom: 7px;
}

.window h2 small {
	font-size: 16px;
	line-height: 30px;
}

.window h3 {
	color: var(--window-heading-color);
	font-size: 18px;
	margin: 20px 0 10px;
}

.window#chat-container {
	/*
		Chat has its own scrollbar, so remove the one on parent
		This caused a performance issue in Chrome
	*/
	overflow: hidden;
}

/* Form elements */
/* stylelint-disable selector-no-vendor-prefix */

#chat-container ::-moz-placeholder {
	color: #b7c5d1;
	opacity: 0.75;
}

#chat-container ::-webkit-input-placeholder {
	color: #b7c5d1;
	opacity: 0.75;
}

#chat-container :-ms-input-placeholder {
	color: #b7c5d1;
	opacity: 0.75;
}

/* stylelint-enable selector-no-vendor-prefix */

.emoji {
	font-size: 1.4em;
	vertical-align: text-top;
	line-height: 1;
}

/* Correctly handle multiple successive whitespace characters.
   For example: user has quit ( ===> L   O   L <=== )  */

.header .topic,
#chat .msg[data-type="action"] .content,
#chat .msg[data-type="message"] .content,
#chat .msg[data-type="monospace_block"] .content,
#chat .msg[data-type="notice"] .content,
#chat .ctcp-message,
#chat .part-reason,
#chat .quit-reason,
#chat .new-topic,
#chat table.channel-list .topic {
	white-space: pre-wrap;
}
</style>

<script>
const constants = require("../js/constants");
import eventbus from "../js/eventbus";
import Mousetrap from "mousetrap";
import throttle from "lodash/throttle";
import storage from "../js/localStorage";
import isIgnoredKeybind from "../js/helpers/isIgnoredKeybind";

import Sidebar from "./Sidebar.vue";
import ImageViewer from "./ImageViewer.vue";
import ContextMenu from "./ContextMenu.vue";
import ConfirmDialog from "./ConfirmDialog.vue";
import Mentions from "./Mentions.vue";

export default {
	name: "App",
	components: {
		Sidebar,
		ImageViewer,
		ContextMenu,
		ConfirmDialog,
		Mentions,
	},
	computed: {
		viewportClasses() {
			return {
				notified: this.$store.getters.highlightCount > 0,
				"menu-open": this.$store.state.appLoaded && this.$store.state.sidebarOpen,
				"menu-dragging": this.$store.state.sidebarDragging,
				"userlist-open": this.$store.state.userlistOpen,
			};
		},
	},
	created() {
		this.prepareOpenStates();
	},
	mounted() {
		Mousetrap.bind("esc", this.escapeKey);
		Mousetrap.bind("alt+u", this.toggleUserList);
		Mousetrap.bind("alt+s", this.toggleSidebar);
		Mousetrap.bind("alt+m", this.toggleMentions);

		// Make a single throttled resize listener available to all components
		this.debouncedResize = throttle(() => {
			eventbus.emit("resize");
		}, 100);

		window.addEventListener("resize", this.debouncedResize, {passive: true});

		// Emit a daychange event every time the day changes so date markers know when to update themselves
		const emitDayChange = () => {
			eventbus.emit("daychange");
			// This should always be 24h later but re-computing exact value just in case
			this.dayChangeTimeout = setTimeout(emitDayChange, this.msUntilNextDay());
		};

		this.dayChangeTimeout = setTimeout(emitDayChange, this.msUntilNextDay());
	},
	beforeDestroy() {
		Mousetrap.unbind("esc", this.escapeKey);
		Mousetrap.unbind("alt+u", this.toggleUserList);
		Mousetrap.unbind("alt+s", this.toggleSidebar);
		Mousetrap.unbind("alt+m", this.toggleMentions);

		window.removeEventListener("resize", this.debouncedResize);
		clearTimeout(this.dayChangeTimeout);
	},
	methods: {
		escapeKey() {
			eventbus.emit("escapekey");
		},
		toggleSidebar(e) {
			if (isIgnoredKeybind(e)) {
				return true;
			}

			this.$store.commit("toggleSidebar");

			return false;
		},
		toggleUserList(e) {
			if (isIgnoredKeybind(e)) {
				return true;
			}

			this.$store.commit("toggleUserlist");

			return false;
		},
		toggleMentions() {
			if (this.$store.state.networks.length !== 0) {
				eventbus.emit("mentions:toggle");
			}
		},
		msUntilNextDay() {
			// Compute how many milliseconds are remaining until the next day starts
			const today = new Date();
			const tommorow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

			return tommorow - today;
		},
		prepareOpenStates() {
			const viewportWidth = window.innerWidth;
			let isUserlistOpen = storage.get("thelounge.state.userlist");

			if (viewportWidth > constants.mobileViewportPixels) {
				this.$store.commit(
					"sidebarOpen",
					storage.get("thelounge.state.sidebar") !== "false"
				);
			}

			// If The Lounge is opened on a small screen (less than 1024px), and we don't have stored
			// user list state, close it by default
			if (viewportWidth >= 1024 && isUserlistOpen !== "true" && isUserlistOpen !== "false") {
				isUserlistOpen = "true";
			}

			this.$store.commit("userlistOpen", isUserlistOpen === "true");
		},
	},
};
</script>
