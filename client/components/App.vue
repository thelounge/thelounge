<template>
	<div id="viewport" :class="viewportClasses" role="tablist">
		<Sidebar :overlay="$refs.overlay" />
		<div id="sidebar-overlay" ref="overlay" @click="$root.setSidebar(false)" />
		<article v-if="$root.initialized" id="windows">
			<router-view></router-view>
		</article>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
const throttle = require("lodash/throttle");

import Sidebar from "./Sidebar.vue";
import ImageViewer from "./ImageViewer.vue";

export default {
	name: "App",
	components: {
		Sidebar,
		ImageViewer,
	},
	props: {
		activeWindow: String,
	},
	computed: {
		viewportClasses() {
			return {
				notified: this.$store.state.isNotified,
				"menu-open": this.$store.state.sidebarOpen,
				"menu-dragging": this.$store.state.sidebarDragging,
				"userlist-open": this.$store.state.userlistOpen,
			};
		},
	},
	mounted() {
		// Make a single throttled resize listener available to all components
		this.debouncedResize = throttle(() => {
			this.$root.$emit("resize");
		}, 100);

		window.addEventListener("resize", this.debouncedResize, {passive: true});

		// Emit a daychange event every time the day changes so date markers know when to update themselves
		const emitDayChange = () => {
			this.$root.$emit("daychange");
			// This should always be 24h later but re-computing exact value just in case
			this.dayChangeTimeout = setTimeout(emitDayChange, this.msUntilNextDay());
		};

		this.dayChangeTimeout = setTimeout(emitDayChange, this.msUntilNextDay());
	},
	beforeDestroy() {
		window.removeEventListener("resize", this.debouncedResize);
		clearTimeout(this.dayChangeTimeout);
	},
	methods: {
		msUntilNextDay() {
			// Compute how many milliseconds are remaining until the next day starts
			const today = new Date();
			const tommorow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

			return tommorow - today;
		},
	},
};
</script>
