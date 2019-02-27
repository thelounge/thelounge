<template>
	<div
		id="viewport"
		:class="{notified: $store.state.isNotified}"
		role="tablist">
		<Sidebar
			:networks="networks"
			:active-channel="activeChannel" />
		<article id="windows">
			<Chat
				v-if="activeChannel"
				:network="activeChannel.network"
				:channel="activeChannel.channel" />
			<component
				:is="activeWindow"
				ref="window" />
		</article>
	</div>
</template>

<script>
const throttle = require("lodash/throttle");

import Sidebar from "./Sidebar.vue";
import NetworkList from "./NetworkList.vue";
import Chat from "./Chat.vue";
import SignIn from "./Windows/SignIn.vue";
import Settings from "./Windows/Settings.vue";
import Help from "./Windows/Help.vue";
import Changelog from "./Windows/Changelog.vue";

export default {
	name: "App",
	components: {
		Sidebar,
		NetworkList,
		Chat,
		SignIn,
		Settings,
		Help,
		Changelog,
	},
	props: {
		activeWindow: String,
		activeChannel: Object,
		networks: Array,
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
		isPublic: () => document.body.classList.contains("public"),
		msUntilNextDay() {
			// Compute how many milliseconds are remaining until the next day starts
			const today = new Date();
			const tommorow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

			return tommorow - today;
		},
	},
};
</script>
