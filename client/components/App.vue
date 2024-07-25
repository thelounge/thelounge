<template>
	<div id="viewport" :class="viewportClasses" role="tablist">
		<Sidebar v-if="store.state.appLoaded" :overlay="overlay" />
		<div
			id="sidebar-overlay"
			ref="overlay"
			aria-hidden="true"
			@click="store.commit('sidebarOpen', false)"
		/>
		<router-view ref="loungeWindow"></router-view>
		<Mentions />
		<ImageViewer ref="imageViewer" />
		<ContextMenu ref="contextMenu" />
		<ConfirmDialog ref="confirmDialog" />
		<div id="upload-overlay"></div>
	</div>
</template>

<script lang="ts">
import constants from "../js/constants";
import eventbus from "../js/eventbus";
import Mousetrap, {ExtendedKeyboardEvent} from "mousetrap";
import throttle from "lodash/throttle";
import storage from "../js/localStorage";
import isIgnoredKeybind from "../js/helpers/isIgnoredKeybind";

import Sidebar from "./Sidebar.vue";
import ImageViewer from "./ImageViewer.vue";
import ContextMenu from "./ContextMenu.vue";
import ConfirmDialog from "./ConfirmDialog.vue";
import Mentions from "./Mentions.vue";
import {
	computed,
	provide,
	defineComponent,
	onBeforeUnmount,
	onMounted,
	ref,
	Ref,
	InjectionKey,
} from "vue";
import {useStore} from "../js/store";
import type {DebouncedFunc} from "lodash";

export const imageViewerKey = Symbol() as InjectionKey<Ref<typeof ImageViewer | null>>;
const contextMenuKey = Symbol() as InjectionKey<Ref<typeof ContextMenu | null>>;
const confirmDialogKey = Symbol() as InjectionKey<Ref<typeof ConfirmDialog | null>>;

export default defineComponent({
	name: "App",
	components: {
		Sidebar,
		ImageViewer,
		ContextMenu,
		ConfirmDialog,
		Mentions,
	},
	setup() {
		const store = useStore();
		const overlay = ref(null);
		const loungeWindow = ref(null);
		const imageViewer = ref(null);
		const contextMenu = ref(null);
		const confirmDialog = ref(null);

		provide(imageViewerKey, imageViewer);
		provide(contextMenuKey, contextMenu);
		provide(confirmDialogKey, confirmDialog);

		const viewportClasses = computed(() => {
			return {
				notified: store.getters.highlightCount > 0,
				"menu-open": store.state.appLoaded && store.state.sidebarOpen,
				"menu-dragging": store.state.sidebarDragging,
				"userlist-open": store.state.userlistOpen,
			};
		});

		const debouncedResize = ref<DebouncedFunc<() => void>>();
		const dayChangeTimeout = ref<any>();

		const escapeKey = () => {
			eventbus.emit("escapekey");
		};

		const toggleSidebar = (e: ExtendedKeyboardEvent) => {
			if (isIgnoredKeybind(e)) {
				return true;
			}

			store.commit("toggleSidebar");

			return false;
		};

		const toggleUserList = (e: ExtendedKeyboardEvent) => {
			if (isIgnoredKeybind(e)) {
				return true;
			}

			store.commit("toggleUserlist");

			return false;
		};

		const toggleMentions = () => {
			if (store.state.networks.length !== 0) {
				eventbus.emit("mentions:toggle");
			}
		};

		const msUntilNextDay = () => {
			// Compute how many milliseconds are remaining until the next day starts
			const today = new Date();
			const tommorow = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + 1
			).getTime();

			return tommorow - today.getTime();
		};

		const prepareOpenStates = () => {
			const viewportWidth = window.innerWidth;
			let isUserlistOpen = storage.get("thelounge.state.userlist");

			if (viewportWidth > constants.mobileViewportPixels) {
				store.commit("sidebarOpen", storage.get("thelounge.state.sidebar") !== "false");
			}

			// If The Lounge is opened on a small screen (less than 1024px), and we don't have stored
			// user list state, close it by default
			if (viewportWidth >= 1024 && isUserlistOpen !== "true" && isUserlistOpen !== "false") {
				isUserlistOpen = "true";
			}

			store.commit("userlistOpen", isUserlistOpen === "true");
		};

		prepareOpenStates();

		onMounted(() => {
			Mousetrap.bind("esc", escapeKey);
			Mousetrap.bind("alt+u", toggleUserList);
			Mousetrap.bind("alt+s", toggleSidebar);
			Mousetrap.bind("alt+m", toggleMentions);

			debouncedResize.value = throttle(() => {
				eventbus.emit("resize");
			}, 100);

			window.addEventListener("resize", debouncedResize.value, {passive: true});

			// Emit a daychange event every time the day changes so date markers know when to update themselves
			const emitDayChange = () => {
				eventbus.emit("daychange");
				// This should always be 24h later but re-computing exact value just in case
				dayChangeTimeout.value = setTimeout(emitDayChange, msUntilNextDay());
			};

			dayChangeTimeout.value = setTimeout(emitDayChange, msUntilNextDay());
		});

		onBeforeUnmount(() => {
			Mousetrap.unbind("esc");
			Mousetrap.unbind("alt+u");
			Mousetrap.unbind("alt+s");
			Mousetrap.unbind("alt+m");

			if (debouncedResize.value) {
				window.removeEventListener("resize", debouncedResize.value);
			}

			if (dayChangeTimeout.value) {
				clearTimeout(dayChangeTimeout.value);
			}
		});

		return {
			viewportClasses,
			escapeKey,
			toggleSidebar,
			toggleUserList,
			toggleMentions,
			store,
			overlay,
			loungeWindow,
			imageViewer,
			contextMenu,
			confirmDialog,
		};
	},
});
</script>
