<template>
	<div
		id="viewport"
		role="tablist">
		<aside id="sidebar">
			<div class="scrollable-area">
				<div class="logo-container">
					<img
						:src="'img/logo-' + ( isPublic() ? 'horizontal-' : '' ) + 'transparent-bg.svg'"
						class="logo"
						alt="The Lounge">
					<img
						:src="'img/logo-' + ( isPublic() ? 'horizontal-' : '' ) + 'transparent-bg-inverted.svg'"
						class="logo-inverted"
						alt="The Lounge">
				</div>
				<NetworkList
					:networks="networks"
					:active-channel="activeChannel" />
			</div>
			<footer id="footer">
				<span
					class="tooltipped tooltipped-n tooltipped-no-touch"
					aria-label="Sign in"><button
						class="icon sign-in"
						data-target="#sign-in"
						aria-label="Sign in"
						role="tab"
						aria-controls="sign-in"
						aria-selected="false" /></span>
				<span
					class="tooltipped tooltipped-n tooltipped-no-touch"
					aria-label="Connect to network"><button
						class="icon connect"
						data-target="#connect"
						aria-label="Connect to network"
						role="tab"
						aria-controls="connect"
						aria-selected="false" /></span>
				<span
					class="tooltipped tooltipped-n tooltipped-no-touch"
					aria-label="Settings"><button
						class="icon settings"
						data-target="#settings"
						aria-label="Settings"
						role="tab"
						aria-controls="settings"
						aria-selected="false" /></span>
				<span
					class="tooltipped tooltipped-n tooltipped-no-touch"
					aria-label="Help"><button
						class="icon help"
						data-target="#help"
						aria-label="Help"
						role="tab"
						aria-controls="help"
						aria-selected="false" /></span>
			</footer>
		</aside>
		<div id="sidebar-overlay" />
		<article id="windows">
			<Chat
				v-if="activeChannel"
				:network="activeChannel.network"
				:channel="activeChannel.channel" />
			<div
				id="sign-in"
				class="window"
				role="tabpanel"
				aria-label="Sign-in" />
			<div
				id="connect"
				class="window"
				role="tabpanel"
				aria-label="Connect" />
			<div
				id="settings"
				class="window"
				role="tabpanel"
				aria-label="Settings" />
			<div
				id="help"
				class="window"
				role="tabpanel"
				aria-label="Help" />
			<div
				id="changelog"
				class="window"
				aria-label="Changelog" />
		</article>
	</div>
</template>

<script>
const moment = require("moment");

import {throttle} from "lodash";

import NetworkList from "./NetworkList.vue";
import Chat from "./Chat.vue";

export default {
	name: "App",
	components: {
		NetworkList,
		Chat,
	},
	props: {
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
			return moment().add(1, "day").startOf("day") - moment();
		},
	},
};
</script>
