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

<script lang="ts">
import constants from "@/js/constants";
import eventbus from "@/js/eventbus";
import Mousetrap from "mousetrap";
import throttle from "lodash/throttle";
import storage from "@/js/localStorage";
import isIgnoredKeybind from "@/js/helpers/isIgnoredKeybind";

import Sidebar from "./Sidebar.vue";
import ImageViewer from "./ImageViewer.vue";
import ContextMenu from "./ContextMenu.vue";
import ConfirmDialog from "./ConfirmDialog.vue";
import Mentions from "./Mentions.vue";
import VueApp from "vue";

// This stops Vue from complaining about adding objects to the component context
declare module "vue/types/vue" {
	interface Vue {
		debouncedResize: () => void;
		dayChangeTimeout: number;
	}
}

export default VueApp.extend({
	name: "App",
	components: {
		Sidebar,
		ImageViewer,
		ContextMenu,
		ConfirmDialog,
		Mentions,
	},
	computed: {
		viewportClasses(): Record<string, boolean> {
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
		Mousetrap.unbind("esc");
		Mousetrap.unbind("alt+u");
		Mousetrap.unbind("alt+s");
		Mousetrap.unbind("alt+m");

		window.removeEventListener("resize", this.debouncedResize);
		clearTimeout(this.dayChangeTimeout);
	},
	methods: {
		escapeKey(): void {
			eventbus.emit("escapekey");
		},
		toggleSidebar(e): boolean {
			if (isIgnoredKeybind(e)) {
				return true;
			}

			this.$store.commit("toggleSidebar");

			return false;
		},
		toggleUserList(e): boolean {
			if (isIgnoredKeybind(e)) {
				return true;
			}

			this.$store.commit("toggleUserlist");

			return false;
		},
		toggleMentions(): void {
			if (this.$store.state.networks.length !== 0) {
				eventbus.emit("mentions:toggle");
			}
		},
		msUntilNextDay(): number {
			// Compute how many milliseconds are remaining until the next day starts
			const today = new Date();
			const tommorow = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + 1
			).getTime();

			return tommorow - today.getTime();
		},
		prepareOpenStates(): void {
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
});
</script>
