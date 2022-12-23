<template>
	<aside id="sidebar" ref="sidebar">
		<div class="scrollable-area">
			<div class="logo-container">
				<img
					:src="`img/logo-${isPublic() ? 'horizontal-' : ''}transparent-bg.svg`"
					class="logo"
					alt="The Lounge"
					role="presentation"
				/>
				<img
					:src="`img/logo-${isPublic() ? 'horizontal-' : ''}transparent-bg-inverted.svg`"
					class="logo-inverted"
					alt="The Lounge"
					role="presentation"
				/>
				<span
					v-if="isDevelopment"
					title="The Lounge has been built in development mode"
					:style="{
						backgroundColor: '#ff9e18',
						color: '#000',
						padding: '2px',
						borderRadius: '4px',
						fontSize: '12px',
					}"
					>DEVELOPER</span
				>
			</div>
			<NetworkList />
		</div>
		<footer id="footer">
			<span
				class="tooltipped tooltipped-n tooltipped-no-touch"
				aria-label="Connect to network"
				><router-link
					v-slot:default="{navigate, isActive}"
					to="/connect"
					role="tab"
					aria-controls="connect"
				>
					<button
						:class="['icon', 'connect', {active: isActive}]"
						:aria-selected="isActive"
						@click="navigate"
						@keypress.enter="navigate"
					/> </router-link
			></span>
			<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="Settings"
				><router-link
					v-slot:default="{navigate, isActive}"
					to="/settings"
					role="tab"
					aria-controls="settings"
				>
					<button
						:class="['icon', 'settings', {active: isActive}]"
						:aria-selected="isActive"
						@click="navigate"
						@keypress.enter="navigate"
					></button> </router-link
			></span>
			<span
				class="tooltipped tooltipped-n tooltipped-no-touch"
				:aria-label="
					store.state.serverConfiguration?.isUpdateAvailable
						? 'Help\n(update available)'
						: 'Help'
				"
				><router-link
					v-slot:default="{navigate, isActive}"
					to="/help"
					role="tab"
					aria-controls="help"
				>
					<button
						:aria-selected="route.name === 'Help'"
						:class="[
							'icon',
							'help',
							{notified: store.state.serverConfiguration?.isUpdateAvailable},
							{active: isActive},
						]"
						@click="navigate"
						@keypress.enter="navigate"
					></button> </router-link
			></span>
		</footer>
	</aside>
</template>

<script lang="ts">
import {defineComponent, nextTick, onMounted, onUnmounted, PropType, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "../js/store";
import NetworkList from "./NetworkList.vue";

export default defineComponent({
	name: "Sidebar",
	components: {
		NetworkList,
	},
	props: {
		overlay: {type: Object as PropType<HTMLElement | null>, required: true},
	},
	setup(props) {
		const isDevelopment = process.env.NODE_ENV !== "production";

		const store = useStore();
		const route = useRoute();

		const touchStartPos = ref<Touch | null>();
		const touchCurPos = ref<Touch | null>();
		const touchStartTime = ref<number>(0);
		const menuWidth = ref<number>(0);
		const menuIsMoving = ref<boolean>(false);
		const menuIsAbsolute = ref<boolean>(false);

		const sidebar = ref<HTMLElement | null>(null);

		const toggle = (state: boolean) => {
			store.commit("sidebarOpen", state);
		};

		const onTouchMove = (e: TouchEvent) => {
			const touch = (touchCurPos.value = e.touches.item(0));

			if (
				!touch ||
				!touchStartPos.value ||
				!touchStartPos.value.screenX ||
				!touchStartPos.value.screenY
			) {
				return;
			}

			let distX = touch.screenX - touchStartPos.value.screenX;
			const distY = touch.screenY - touchStartPos.value.screenY;

			if (!menuIsMoving.value) {
				// tan(45°) is 1. Gestures in 0°-45° (< 1) are considered horizontal, so
				// menu must be open; gestures in 45°-90° (>1) are considered vertical, so
				// chat windows must be scrolled.
				if (Math.abs(distY / distX) >= 1) {
					// eslint-disable-next-line no-use-before-define
					onTouchEnd();
					return;
				}

				const devicePixelRatio = window.devicePixelRatio || 2;

				if (Math.abs(distX) > devicePixelRatio) {
					store.commit("sidebarDragging", true);
					menuIsMoving.value = true;
				}
			}

			// Do not animate the menu on desktop view
			if (!menuIsAbsolute.value) {
				return;
			}

			if (store.state.sidebarOpen) {
				distX += menuWidth.value;
			}

			if (distX > menuWidth.value) {
				distX = menuWidth.value;
			} else if (distX < 0) {
				distX = 0;
			}

			if (sidebar.value) {
				sidebar.value.style.transform = "translate3d(" + distX.toString() + "px, 0, 0)";
			}

			if (props.overlay) {
				props.overlay.style.opacity = `${distX / menuWidth.value}`;
			}
		};

		const onTouchEnd = () => {
			if (!touchStartPos.value?.screenX || !touchCurPos.value?.screenX) {
				return;
			}

			const diff = touchCurPos.value.screenX - touchStartPos.value.screenX;
			const absDiff = Math.abs(diff);

			if (
				absDiff > menuWidth.value / 2 ||
				(Date.now() - touchStartTime.value < 180 && absDiff > 50)
			) {
				toggle(diff > 0);
			}

			document.body.removeEventListener("touchmove", onTouchMove);
			document.body.removeEventListener("touchend", onTouchEnd);

			store.commit("sidebarDragging", false);

			touchStartPos.value = null;
			touchCurPos.value = null;
			touchStartTime.value = 0;
			menuIsMoving.value = false;

			void nextTick(() => {
				if (sidebar.value) {
					sidebar.value.style.transform = "";
				}

				if (props.overlay) {
					props.overlay.style.opacity = "";
				}
			});
		};

		const onTouchStart = (e: TouchEvent) => {
			if (!sidebar.value) {
				return;
			}

			touchStartPos.value = touchCurPos.value = e.touches.item(0);

			if (e.touches.length !== 1) {
				onTouchEnd();
				return;
			}

			const styles = window.getComputedStyle(sidebar.value);

			menuWidth.value = parseFloat(styles.width);
			menuIsAbsolute.value = styles.position === "absolute";

			if (
				!store.state.sidebarOpen ||
				(touchStartPos.value?.screenX && touchStartPos.value.screenX > menuWidth.value)
			) {
				touchStartTime.value = Date.now();

				document.body.addEventListener("touchmove", onTouchMove, {passive: true});
				document.body.addEventListener("touchend", onTouchEnd, {passive: true});
			}
		};

		onMounted(() => {
			document.body.addEventListener("touchstart", onTouchStart, {passive: true});
		});

		onUnmounted(() => {
			document.body.removeEventListener("touchstart", onTouchStart);
		});

		const isPublic = () => document.body.classList.contains("public");

		return {
			isDevelopment,
			store,
			route,
			sidebar,
			toggle,
			onTouchStart,
			onTouchMove,
			onTouchEnd,
			isPublic,
		};
	},
});
</script>
